import type { Request, Response } from "express";
import {
	getAllTags,
	getSpecificTag,
	postTag,
	verifyTagName,
} from "../db/queries";
import { body, validationResult } from "express-validator";
export async function getTags(req: Request, res: Response) {
	const tags = await getAllTags();
	res.render("pages/tags", { tags });
}
export async function getAddTags(req: Request, res: Response) {
	res.render("pages/addTag");
}

const validatorTagForm = [
	body("name_tag")
		.trim()
		.isString()
		.withMessage("Tag is not valid")
		.isLength({ min: 2, max: 20 })
		.withMessage("Tag is required"),
];

export const postTagC = [
	validatorTagForm,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("pages/addTag", { errors: errors.array() });
		}
		try {
			const { name_tag } = req.body;
			await postTag(name_tag);
			res.redirect("/manhwa/add");
		} catch (err) {
			return res.render("pages/addTag", {
				errors: [{ msg: "Tag already exists" }],
			});
		}
	},
];
