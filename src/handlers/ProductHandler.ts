import { ReqRefDefaults, ResponseToolkit, RouteOptions } from "@hapi/hapi";
import wooCommerceApi from "../configs/woocommerce";
import db from "../configs/db";
import Joi from "joi";
import { fileUpload, imageFilter } from "../utils";

const UPLOAD_PATH =  __dirname + "/../../public/uploads";
const fileOptions: FileUploaderOption = { dest: `${UPLOAD_PATH}/`, fileFilter: imageFilter };
const HOST = process.env.APP_HOST || "localhost";
const PORT = process.env.APP_PORT || 4000;

// TODO: add stock

export const createProductRouteOption: RouteOptions<ReqRefDefaults> = {
    payload: {
        multipart: {output: 'stream'},
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: 1000 * 1000 * 10, // 10 Mb
    },
    validate: {
        payload: Joi.object({
            sku: Joi.string().required(),
            name: Joi.string().required(),
            image: Joi.any().required(),
            price: Joi.number().required(),
            description: Joi.string(),
        })
    }
}
export const updateProductRouteOption: RouteOptions<ReqRefDefaults> = {
    payload: {
        multipart: {output: 'stream'},
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: 1000 * 1000 * 10, // 10 Mb
    },
    validate: {
        params: Joi.object({
            sku: Joi.string().required()
        }),
        payload: Joi.object({
            sku: Joi.string().required(),
            name: Joi.string().required(),
            image: Joi.any().required(),
            price: Joi.number().required(),
            description: Joi.string(),
        })
    }
}

export const findBySkuRouteOption: RouteOptions<ReqRefDefaults>  = {
    validate: {
        params: Joi.object({
            sku: Joi.string().required()
        })
    }
}

export async function paginateProducts(request: PaginateRequest, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        var page = request.query.page || 1;
        var size = request.query.size || 10;
        
        var offset = (page - 1) * size;

        var query = await db.query<Product>(`
            SELECT
                p.sku,
                p.name,
                p.image,
                p.price,
                sum(at.qty) AS stock
            FROM products p
            LEFT JOIN adjustment_transactions at on p.sku = at.sku
            GROUP BY p.sku
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

export async function findProductBySku(request: ProductBySkuRequest, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        const products = await client.query<Product>(`
            SELECT
                p.sku,
                p.name,
                p.image,
                p.price,
                p.description,
                sum(at.qty) AS stock
            FROM products p
            LEFT JOIN adjustment_transactions at on p.sku = at.sku
            WHERE p.sku = $1 
            GROUP BY p.sku
            LIMIT 1`, [request.params.sku])
        client.release()
        if (products.rowCount == 0) {
            return h.response({
                message: "Product not found"
            }).code(404)
        }
        return products.rows[0];
    } catch (error) {
        console.error("Error:", error)
        client.release()
        return h.response({
            message: "Server Error"
        }).code(500)
    }
}

export async function createProduct(request: CreateProductRequest, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        const image = request.payload.image
        var uploadedFile = await fileUpload(image, fileOptions)
        var imageUrl = `${HOST}:${PORT}/uploads/${uploadedFile.filename}`

        const { rows } = await client.query<Product>(
            "INSERT INTO products(sku, name, image, price, description) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [request.payload.sku, request.payload.name, imageUrl, request.payload.price, request.payload.description || null]
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

export async function updateProduct(request: UpdateProductRequest, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        const image = request.payload.image
        var uploadedFile = await fileUpload(image, fileOptions)
        var imageUrl = `${HOST}:${PORT}/uploads/${uploadedFile.filename}`

        const { rows } = await client.query<Product>(
            "UPDATE products SET sku = $1, name = $2, image = $3, price = $4, description = $5 WHERE sku = $6 RETURNING *",
            [request.payload.sku, request.payload.name, imageUrl, request.payload.price, request.payload.description || null, request.params.sku]
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

export async function deleteProductBySku(request: ProductBySkuRequest, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        await client.query("DELETE FROM products WHERE sku = $1", [request.params.sku])
        client.release()
        return h.response({
            message: "Product has been deleted"
        }).code(200)
    } catch (error) {
        console.error("Error:", error)
        client.release()
        return h.response({
            message: "Server Error"
        }).code(500)
    }
}

export async function fetchJubelioProducts(request: Request, h: ResponseToolkit) {
    const client = await db.connect();
    try {
        const response: ResponseWoo<ProductWoo[]> = await wooCommerceApi.get("products");
        var insertQueries = []
        for (const productWoo of response.data) {
            insertQueries.push(client.query(`INSERT INTO products(sku, name, image, price, description)
            VALUES($1, $2, $3, $4, $5) ON CONFLICT (sku) DO NOTHING`, [
                productWoo.sku,
                productWoo.name,
                productWoo.images[0].src,
                productWoo.price,
                productWoo.description
            ]))
        }
        await Promise.all(insertQueries)
        client.release()
        return response.data
    } catch (error) {
        console.error("Error:", error)
        client.release()
        return h.response({
            message: "Server Error"
        }).code(500)
    }
}

