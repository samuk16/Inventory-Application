import { join } from "node:path";
import { pool } from "./pool";

// MANHWAS

export async function getAllManhwas() {
	const { rows } = await pool.query("Select * from manhwas");
	return rows;
}

export async function postManhwasTags(tags: number[], manhwaId: number) {
	const tagsArr = tags.map((tag) => `(${tag},${manhwaId})`).join(",");
	const query = `INSERT INTO manhwas_tags (tag_id,manhwa_id) VALUES ${tagsArr}`;

	const { rows } = await pool.query(query);
	return rows;
}
export async function postUpdateManhwa(
	title: string,
	description: string,
	caps: number,
	url_img: string,
	author_id: number,
	manhwaId: number,
) {
	const { rows } = await pool.query(
		`UPDATE manhwas SET 
		title = $1,
		description = $2,
		caps = $3,
		url_img = $4,
		author_id = $5
		WHERE id = $6 AND (title != $1 OR description != $2 OR caps != $3 OR url_img != $4 OR author_id != $5)`,
		[title, description, caps, url_img, author_id, manhwaId],
	);
	return rows;
}

export async function deleteManhwa(manwhaId: number) {
	const { rows } = await pool.query("DELETE FROM manhwas WHERE id = $1", [
		manwhaId,
	]);
	return rows;
}

export async function postUpdateManhwasTags(tags: number[], manhwaId: number) {
	const tagsArr = tags.map((tag) => `(${tag},${manhwaId})`).join(",");
	const query = `INSERT INTO manhwas_tags (tag_id,manhwa_id) VALUES ${tagsArr} ON CONFLICT DO NOTHING;`;
	// const query = `UPDATE manhwas_tags SET tag_id = $1 WHERE manhwa_id = $2  ${tagsArr}`;

	const { rows } = await pool.query(query);
	return rows;
}
export async function deleteManhwasTags(manhwaId: number, tags: number[]) {
	const deleteQuery = `DELETE FROM manhwas_tags WHERE manhwa_id = $1 AND tag_id NOT IN (${tags.join(",")})`;

	const { rows } = await pool.query(deleteQuery, [manhwaId]);
	return rows;
}

export async function getManhwaId(titleManhwa: string) {
	const { rows } = await pool.query("SELECT id FROM manhwas WHERE title = $1", [
		titleManhwa,
	]);
	return rows;
}
export async function getManhwaWithId(manhwaId: number) {
	const { rows } = await pool.query("SELECT * FROM manhwas WHERE id = $1", [
		manhwaId,
	]);
	return rows;
}

export async function verifyTitleManhwa(titleManhwa: string) {
	const { rows } = await pool.query(
		"SELECT title FROM manhwas WHERE title = $1",
		[titleManhwa],
	);
	return rows;
}

export async function postManhwa(
	title: string,
	description: string,
	caps: number,
	url_img: string,
	author_id: number,
	passManhwa: string,
) {
	const { rows } = await pool.query(
		"INSERT INTO manhwas (title,description,caps,url_img,author_id,password) VALUES ($1,$2,$3,$4,$5,$6)",
		[title, description, caps, url_img, author_id, passManhwa],
	);
	return rows;
}

export async function getHashPass(manhwaId: string) {
	const { rows } = await pool.query(
		"SELECT password FROM manhwas WHERE id = $1",
		[manhwaId],
	);
	return rows;
}

// AUTHORS

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

// TAGS

export async function getAllTags() {
	const { rows } = await pool.query("SELECT * FROM tags");
	return rows;
}

export async function postTag(nameTag: string) {
	const { rows } = await pool.query("INSERT INTO tags (name_tag) VALUES ($1)", [
		nameTag,
	]);
	return rows;
}

export async function getTagsNameOfManhwa(id: number) {
	const { rows } = await pool.query(
		"SELECT tags.name_tag FROM manhwas JOIN manhwas_tags ON manhwas.id = manhwas_tags.manhwa_id JOIN tags ON manhwas_tags.tag_id = tags.id WHERE manhwas.id = $1",
		[id],
	);
	return rows;
}
export async function getTagsIdOfManhwa(id: number) {
	const { rows } = await pool.query(
		"SELECT tags.id FROM manhwas JOIN manhwas_tags ON manhwas.id = manhwas_tags.manhwa_id JOIN tags ON manhwas_tags.tag_id = tags.id WHERE manhwas.id = $1",
		[id],
	);
	return rows;
}

export async function verifyTagName(titleManhwa: string) {
	const { rows } = await pool.query(
		"SELECT name_tag FROM tags WHERE name_Tag = $1",
		[titleManhwa],
	);
	return rows;
}
