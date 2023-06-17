# Jubelio Interview test by Naufal
I have done this project for interview purposes

## Requirements
1. Node > 16
2. Postgresql >= 14
3. yarn >= 1.22

## Dependencies
1. [Hapi.js](https://hapi.dev/)
2. [dotenv](https://www.npmjs.com/package/dotenv)
3. [pg](https://node-postgres.com/)
4. [joi](https://joi.dev/api/)

## Steps to run
1. Import `resources/db.sql` to your Postgresql database
2. Copy `.env.example` to `.env` and edit with your configuration
3. Import `resources/Jubelio Test.postman_collection.json` to your postman
4. Run in terminal `yarn` to install dependecies
5. Run dev server `yarn dev`

## App structure
```bash
├── dist
├── public
│   ├── uploads
├── resources
├── src
│   ├── configs
│   │   ├── db.ts
│   │   ├── woocommerce.ts
│   ├── handlers
│   │   ├── AdjustmentTransactionHandler.ts
│   │   ├── ProductHandler.ts
│   ├── main.ts
│   ├── server.ts
│   ├── utils.ts
│   ├── global.d.ts
├── .env
├── .env.example
├── .gitignore
├── nodemon.json
├── package.json
├── README.md
├── tsconfig.json
```

## List of Routes

```sh
# API Routes for Product:

+--------+------------------------------+----------------------------------+
  Method | URI                          | Description                      |
+--------+------------------------------+----------------------------------+
  POST   | /api//fill-jubelio-products   | Fill database from woocommerce   |
  GET    | /api/products?page=1&size=5  | Get product with pagination      |
  GET    | /api/products/{sku}          | Detail product                   |
  DELETE | /api/products/{sku}          | Delete product                   |
  POST   | /api/products                | Create product                   |
  PUT    | /api/products/{sku}          | Update product                   |
+--------+------------------------------+----------------------------------+

# API Routes for Adjustment Transaction:

+--------+----------------------------------------------+-----------------------+
  Method | URI                                          | Description           |
+--------+----------------------------------------------+-----------------------+
  GET    | /api/adjustment-transactions?page=1&size=5   | Get with pagination   |
  GET    | /api/adjustment-transactions/{id}            | Detail                |
  DELETE | /api/adjustment-transactions/{id}            | Delete                |
  POST   | /api/adjustment-transactions                 | Create                |
  PUT    | /api/adjustment-transactions/{id}            | Update                |
+--------+----------------------------------------------+-----------------------+
```