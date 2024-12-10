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
export async function getAllTags() {
	const { rows } = await pool.query("SELECT * FROM tags");
	return rows;
}
export async function postManhwasTags(tags: number[], manhwaId: number) {
	const tagsArr = tags.map((tag) => `(${tag},${manhwaId})`).join(",");
	const query = `INSERT INTO manhwas_tags (tag_id,manhwa_id) VALUES ${tagsArr}`;

	const { rows } = await pool.query(query);
	return rows;
}

export async function verifyTitleManhwa(titleManhwa: string) {
	const { rows } = await pool.query(
		"SELECT title FROM manhwas WHERE title = $1",
		[titleManhwa],
	);
	return rows;
}
export async function getManhwaId(titleManhwa: string) {
	const { rows } = await pool.query("SELECT id FROM manhwas WHERE title = $1", [
		titleManhwa,
	]);
	return rows;
}
export async function postManhwa(
	title: string,
	description: string,
	caps: number,
	url_img: string,
	author_id: number,
) {
	const { rows } = await pool.query(
		"INSERT INTO manhwas (title,description,caps,url_img,author_id) VALUES ($1,$2,$3,$4,$5)",
		[title, description, caps, url_img, author_id],
	);
	return rows;
}
