import { pool } from "./pool";

export async function getAllManhwas() {
	const { rows } = await pool.query("Select * from manhwas");
	return rows;
}
