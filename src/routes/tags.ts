import { Router } from "express";
import { getAddTags, getTags, postTagC } from "../controllers/tagController";
const tagsRouter = Router();

tagsRouter.get("/", getTags);
tagsRouter.get("/add", getAddTags);
tagsRouter.post("/add", ...postTagC);

export default tagsRouter;
