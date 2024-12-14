import { Router } from "express";
import {
	getAddManhwaGET,
	getManhwa,
	getManhwaView,
	postManhwaC,
} from "../controllers/manhwaController";

const manhwaRouter = Router();

manhwaRouter.get("/", getManhwa);
manhwaRouter.get("/add", getAddManhwaGET);
manhwaRouter.post("/add", ...postManhwaC);
manhwaRouter.get("/:id", getManhwaView);
manhwaRouter.get("/edit/:id");
export default manhwaRouter;
