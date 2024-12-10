import type { Request, Response } from "express";
import { getAllTags } from "../db/queries";
import { body, validationResult } from "express-validator";
export async function getTags(req: Request, res: Response) {
	const tags = await getAllTags();
	res.render("pages/tags", { tags });
}

const validatorTagForm = [
	body("name_tag")
		.trim()
		.isAlpha()
		.withMessage("Tag is not valid")
		.isLength({ min: 2, max: 20 })
		.withMessage("Tag is required"),
];

export const postTag = [
	validatorTagForm,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("pages/addTag", { errors: errors.array() });
		}
		const { name_tag } = req.body;
		console.log(name_tag);
		// await postAuthor(name_tag);
		res.redirect("/manhwa/add");
	},
];
