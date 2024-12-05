import { getAllManhwas } from "../db/queries";
import type { Request, Response } from "express";

export async function getManwhas(req: Request, res: Response) {
	const manhwas = await getAllManhwas();
	res.render("pages/index", { manhwas });
}
