import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const db = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT!),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

});

db.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

export default db;