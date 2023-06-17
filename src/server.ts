'use strict';

import Hapi from "@hapi/hapi";
import { Server } from "@hapi/hapi";
import {
    createProduct,
    createProductRouteOption,
    deleteProductBySku,
    fetchJubelioProducts,
    findBySkuRouteOption,
    findProductBySku,
    paginateProducts,
    updateProduct,
    updateProductRouteOption
} from "./handlers/ProductHandler";
import Joi from "joi";
import path from "path";
import {
    createAdjustmentTransaction,
    createAdjustmentTransactionRouteOption,
    deleteAdjustmentTransactionById,
    findAdjustmentTransactionById,
    findAdjustmentTransactionRouteOption,
    paginateAdjustmentTransaction,
    updateAdjustmentTransaction,
    updateAdjustmentTransactionRouteOption
} from "./handlers/AdjustmentTransactionHandler";

export let server: Server;

export const init = async function(): Promise<Server> {
    server = Hapi.server({
        host: process.env.APP_HOST ||'0.0.0.0',
        port: process.env.APP_PORT || 4000,
        routes: {
            files: {
                relativeTo: path.join(__dirname, '../public')
            }
        }
    });

    await server.register(require('@hapi/inert'));
    
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../public')
            }
        }
    });
    // products
    server.route({
        method: "GET",
        path: "/api/products",
        handler: paginateProducts
    });
    server.route({
        method: "POST",
        path: "/api/products",
        handler: createProduct,
        options: createProductRouteOption
    });
    server.route({
        method: "PUT",
        path: "/api/products/{sku}",
        handler: updateProduct,
        options: updateProductRouteOption
    });
    server.route({
        method: "DELETE",
        path: "/api/products/{sku}",
        handler: deleteProductBySku,
        options: findBySkuRouteOption
    });
    server.route({
        method: "GET",
        path: "/api/products/{sku}",
        handler: findProductBySku,
        options: {
            validate: {
                params: Joi.object({
                    sku: Joi.string().required()
                })
            }
        }
    });
    server.route({
        method: "POST",
        path: "/api/fill-jubelio-products",
        handler: fetchJubelioProducts
    });

    // adjustment transaction
    server.route({
        method: "POST",
        path: "/api/adjustment-transactions",
        handler: createAdjustmentTransaction,
        options: createAdjustmentTransactionRouteOption
    })
    server.route({
        method: "PUT",
        path: "/api/adjustment-transactions/{id}",
        handler: updateAdjustmentTransaction,
        options: updateAdjustmentTransactionRouteOption
    })
    server.route({
        method: "GET",
        path: "/api/adjustment-transactions",
        handler: paginateAdjustmentTransaction
    })
    server.route({
        method: "GET",
        path: "/api/adjustment-transactions/{id}",
        handler: findAdjustmentTransactionById,
        options: findAdjustmentTransactionRouteOption
    })
    server.route({
        method: "DELETE",
        path: "/api/adjustment-transactions/{id}",
        handler: deleteAdjustmentTransactionById,
        options: findAdjustmentTransactionRouteOption
    })
    
    return server;
};

export const start = async function (): Promise<void> {
    console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
    return server.start();
};

process.on('unhandledRejection', (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});