# Jubelio Interview test by Naufal

## Dependencies
1. [Hapi.js](https://hapi.dev/)
2. [dotenv](https://www.npmjs.com/package/dotenv)
3. [pg](https://node-postgres.com/)
4. [joi](https://joi.dev/api/)

## Run development server
1. Copy `.env.example` to `.env` and adjust with your configuration
2. Run dev server `yarn dev`

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