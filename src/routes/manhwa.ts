import { Router } from "express";
import { getAddManhwaGET, getManhwa } from "../controllers/manhwaController";
const manhwaRouter = Router();

manhwaRouter.get("/", getManhwa);
manhwaRouter.get("/add", getAddManhwaGET);
// manhwaRouter.post("/add-author", ...postAuthorF);

export default manhwaRouter;
