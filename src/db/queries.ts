import { pool } from "./pool";

export async function getAllManhwas() {
	const { rows } = await pool.query("Select * from manhwas");
	return rows;
}

export async function postAuthor(name: string) {
	const { rows } = await pool.query(
		"INSERT INTO authors (name_author) VALUES ($1)",
		[name],
	);
	return rows;
}

export async function getAllAuthors() {
	const { rows } = await pool.query("SELECT * FROM authors");
	return rows;
}
