import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const dbUrl = process.env.CONNECTION_DB_URL;
export const pool = new Pool({
	connectionString: dbUrl,
});
