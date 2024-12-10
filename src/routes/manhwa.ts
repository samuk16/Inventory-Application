import { Router } from "express";
import {
	getAddManhwaGET,
	getManhwa,
	postManhwaC,
} from "../controllers/manhwaController";

const manhwaRouter = Router();

manhwaRouter.get("/", getManhwa);
manhwaRouter.get("/add", getAddManhwaGET);
manhwaRouter.post("/add", ...postManhwaC);

export default manhwaRouter;
