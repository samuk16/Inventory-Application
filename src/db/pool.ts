import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();
const dbUrl = process.env.CONNECTION_DB_URL;
export const pool = new Pool({
	connectionString: dbUrl,
});
