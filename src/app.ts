import express from "express";
import dotenv from "dotenv";
// import path from "node:path";
import indexRouter from "./routes";
import manhwaRouter from "./routes/manhwa";
import authorRouter from "./routes/author";
import tagsRouter from "./routes/tags";
import methodOverride from "method-override";
import { deleteManhwaC } from "./controllers/manhwaController";
import type { Request, Response, NextFunction } from "express";

import path from "node:path";
import { fileURLToPath } from "node:url";

// Obtén el equivalente de __dirname
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/manhwa", manhwaRouter);
app.use("/author", authorRouter);
app.use("/tags", tagsRouter);

app.use(methodOverride("_method"));
app.delete("/manhwa/:id", ...deleteManhwaC);
const PORT = process.env.PORT || 8000;

interface CustomError extends Error {
	status?: number;
}

app.get("*", (req: Request, res: Response, next: NextFunction) => {
	const error: CustomError = new Error("Page not found!");
	error.status = 404;
	next(error);
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);

	const statusCode = err.status || 500;

	// if (statusCode === 404) {
	res.render("pages/404");
	// }
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
