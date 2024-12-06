import { Router } from "express";
import { getAddAuthor, getAuthors } from "../controllers/authorController";
import { postAuthorF } from "../controllers/authorController";
const authorRouter = Router();

authorRouter.get("/", getAuthors);
authorRouter.get("/add", getAddAuthor);

authorRouter.post("/add", ...postAuthorF);

export default authorRouter;
