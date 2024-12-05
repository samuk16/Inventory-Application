import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import indexRouter from "./routes";
import addManhwaRouter from "./routes/addManhwa";
dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/new-manhwa", addManhwaRouter);
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
