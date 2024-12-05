import { Router } from "express";
import type { Request, Response } from "express";
import { getManwhas } from "../controllers/indexController";
const indexRouter = Router();

indexRouter.get("/", getManwhas);

export default indexRouter;
