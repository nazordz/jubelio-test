import { ReqRefDefaults, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import db from "../configs/db";
import Joi from "joi";

export const createAdjustmentTransactionRouteOption: RouteOptions<ReqRefDefaults> = {
    validate: {
        payload: Joi.object({
            sku: Joi.string().required(),
            qty: Joi.string().required()
        })
    }
}
export const updateAdjustmentTransactionRouteOption: RouteOptions<ReqRefDefaults> = {
    validate: {
        params: Joi.object({
            id: Joi.string().required()   
        }),
        payload: Joi.object({
            sku: Joi.string().required(),
            qty: Joi.string().required()
        })
    }
}

export const findAdjustmentTransactionRouteOption: RouteOptions<ReqRefDefaults> = {
    validate: {
        params: Joi.object({
            id: Joi.string().required()
        })
    }
}

export async function createAdjustmentTransaction(request: CreateAdjustmentTransactionRequest, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        const products = await client.query<Product>(`
            SELECT
                p.sku,
                p.name,
                p.image,
                p.price,
                sum(at.qty) AS stock
            FROM products p
            LEFT JOIN adjustment_transactions at on p.sku = at.sku
            WHERE p.sku = $1 
            GROUP BY p.sku
            LIMIT 1`, [request.payload.sku])
        
        var stock = products.rows[0].stock
        if (stock != null && stock == 0) {
            client.release();
            return h.response({
                message: "Stock is 0, You can't create transaction"
            }).code(400)
        }
            
        const { rows } = await client.query<AdjustmentTransaction>(
            "INSERT INTO adjustment_transactions(sku, qty) VALUES($1, $2) RETURNING *",
            [request.payload.sku, Number(request.payload.qty)]
        )
        client.release();
        return rows[0]
    } catch (error) {
        console.error("Error:", error)
        client.release()
        return h.response({
            message: "Server Error"
        }).code(500)
    }
}

export async function paginateAdjustmentTransaction(request: PaginateRequest, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        var page = request.query.page || 1;
        var size = request.query.size || 10;
        
        var offset = (page - 1) * size;

        var query = await db.query<AdjustmentTransaction>(
            `SELECT
                at.id,
                at.sku,
                at.qty,
                (p.price * at.qty) AS amount
            FROM
                adjustment_transactions at 
            INNER JOIN products p ON at.sku = p.sku
            LIMIT $1 OFFSET $2`,
            [size, offset]
        );
        client.release()
        return query.rows
    } catch (error) {
        console.error("Error:", error)
        client.release()
        return h.response({
            message: "Server Error"
        }).code(500)
    }
}

export async function findAdjustmentTransactionById(request: AdjustmentTransactionByIdRequest, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        var query = await db.query<AdjustmentTransaction>(
            `SELECT
                at.id,
                at.sku,
                at.qty,
                (p.price * at.qty) AS amount
            FROM
                adjustment_transactions at 
            INNER JOIN products p ON at.sku = p.sku
            WHERE at.id = $1
            LIMIT 1`,
            [request.params.id]
        );
        client.release()
        if (query.rowCount == 0) {
            return h.response({
                message: "Adjustment transactions not found"
            }).code(404)
        }
        return query.rows[0]
    } catch (error) {
        console.error("Error:", error)
        client.release()
        return h.response({
            message: "Server Error"
        }).code(500)
    }
}

export async function deleteAdjustmentTransactionById(request: AdjustmentTransactionByIdRequest, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        await client.query("DELETE FROM adjustment_transactions WHERE id = $1", [request.params.id])
        client.release()
        return h.response({
            message: "adjustment transactions has been deleted"
        }).code(200)
    } catch (error) {
        console.error("Error:", error)
        client.release()
        return h.response({
            message: "Server Error"
        }).code(500)
    }
}

export async function updateAdjustmentTransaction(request: UpdateAdjustmentTransactionRequest, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        const { rows } = await client.query<Product>(
            "UPDATE adjustment_transactions SET sku = $1, qty = $2 WHERE id = $3 RETURNING *",
            [request.payload.sku, request.payload.qty, request.params.id]
        );
        
        client.release()
        return h.response(rows[0]).code(200);
    } catch (error) {
        console.error("Error:", error)
        client.release()
        return h.response({
            message: "SKU already taken"
        }).code(400)
    }
}