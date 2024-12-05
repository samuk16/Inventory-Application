import { Client } from "pg";
import { argv } from "node:process";

// const date = new Date();

const SQL3 = `
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name_tag VARCHAR (25)
);
`;
const SQL = `
CREATE TABLE IF NOT EXISTS authors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name_author VARCHAR (255)
);
`;
const SQL2 = `
CREATE TABLE IF NOT EXISTS manhwas (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR (255),
  description VARCHAR(255),
  caps INTEGER,
  url_img VARCHAR(255),
  author_id INTEGER REFERENCES authors
);
`;
const SQL4 = `
CREATE TABLE IF NOT EXISTS manhwas_tags (
   manhwa_id INTEGER REFERENCES manhwas(id) ON DELETE CASCADE,
   tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
   PRIMARY KEY (manhwa_id, tag_id)
);
`;

const insertQuery = `
INSERT INTO tags (name_tag) 
VALUES
  ('Reencarnation'),
  ('Isekai'),
  ('Games'),
  ('Action'),
  ('Adventure'),
  ('Shonen'),
  ('Anti-hero');`;
const insertQuery2 = `
INSERT INTO manhwas (title,description,caps,url_img,author_id) 
VALUES
  ('El verdugo','test',40,'https://dashboard.olympuscomic.com/storage/comics/covers/1314/portada-xl.webp',1);`;

const insertQuery3 = `
INSERT INTO authors (name_author) 
VALUES
  ('author 1');`;
async function main() {
	console.log("seeding...");
	const client = new Client({
		connectionString: argv[2],
	});
	try {
		await client.connect();
		// await client.query(SQL3);
		// await client.query(SQL);
		// await client.query(SQL2);
		// await client.query(SQL4);
		// await client.query(insertQuery, [date]);
		await client.query(insertQuery);
		await client.query(insertQuery3);
		await client.query(insertQuery2);
		console.log("done");
	} catch (err) {
		console.log(err);
	} finally {
		await client.end();
	}
}

main();
