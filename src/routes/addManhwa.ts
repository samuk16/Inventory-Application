import { Router } from "express";
import { getAddManhwaGET } from "../controllers/addManhwaController";
const addManhwaRouter = Router();

addManhwaRouter.get("/", getAddManhwaGET);

export default addManhwaRouter;
