import { Router } from "express";
import { getTags } from "../controllers/tagController";
const tagsRouter = Router();

tagsRouter.get("/", getTags);

export default tagsRouter;
