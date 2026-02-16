import { Pool } from 'pg';
import dotenv from 'dotenv';

// loads .env variables
dotenv.config();

// create a new connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// event listener that runs whener a new connection to teh database is established
pool.on("connect", () => {
  console.log("Connected to the database");
})

pool.on("error", (err) => {
  console.error("Databse error", err);
})

export default pool;