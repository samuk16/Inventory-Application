import { Router } from "express";
import {
	getAddManhwaGET,
	getManhwa,
	getManhwaView,
	postManhwaC,
	getManhwaEdit,
	postUpdateManhwaC,
	deleteManhwaC,
} from "../controllers/manhwaController";

const manhwaRouter = Router();

manhwaRouter.get("/", getManhwa);
manhwaRouter.get("/add", getAddManhwaGET);
manhwaRouter.post("/add", ...postManhwaC);
manhwaRouter.get("/:id", getManhwaView);
manhwaRouter.get("/edit/:id", getManhwaEdit);
manhwaRouter.post("/edit/:id", ...postUpdateManhwaC);
// manhwaRouter.delete("/:id", deleteManhwaC);
export default manhwaRouter;
