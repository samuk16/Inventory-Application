import type { Request, Response } from "express";

export async function getAddManhwaGET(req: Request, res: Response) {
	res.render("pages/addManhwa");
}
