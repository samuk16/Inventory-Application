import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { getAllManhwas, postAuthor } from "../db/queries";
export async function getAddManhwaGET(req: Request, res: Response) {
	res.render("pages/addManhwa");
}
export async function getManhwa(req: Request, res: Response) {
	const manhwas = await getAllManhwas();
	res.render("pages/manhwa", { manhwas });
}

const validatorManhwaForm = [
	body("name_manhwa")
		.isAlpha()
		.withMessage("Name is not valid")
		.notEmpty()
		.withMessage("Name is required"),
];

export const postManhwa = [
	validatorManhwaForm,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name_manhwa } = req.body;
		console.log(name_manhwa);
		// await postAuthor(name_author);
		res.redirect("/");
	},
];

// export async function postAuthor(req: Request, res: Response) {}
