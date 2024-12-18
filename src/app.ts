import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import indexRouter from "./routes";
import manhwaRouter from "./routes/manhwa";
import authorRouter from "./routes/author";
import tagsRouter from "./routes/tags";
import methodOverride from "method-override";
import { deleteManhwaC } from "./controllers/manhwaController";
dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));
// app.use("/static", express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/manhwa", manhwaRouter);
app.use("/author", authorRouter);
app.use("/tags", tagsRouter);

app.use(methodOverride("_method"));
app.delete("/manhwa/:id", deleteManhwaC);
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
