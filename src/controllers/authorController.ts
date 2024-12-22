import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { getAllAuthors, getSpecificAuthor, postAuthor } from "../db/queries";
export async function getAddAuthor(req: Request, res: Response) {
	res.render("pages/addAuthor");
}
export async function getAuthors(req: Request, res: Response) {
	const authors = await getAllAuthors();
	res.render("pages/author", { authors });
}

const alphaErr = "must only contain letters";
const lenghtErr = "must be between 2 and 25 characters";
const validatorAuthorForm = [
	body("name_author")
		.trim()
		.isString()
		.withMessage(`Author name ${alphaErr}`)
		.isLength({ min: 2, max: 25 })
		.withMessage(`Author name ${lenghtErr}`),
];

export const postAuthorF = [
	validatorAuthorForm,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("pages/addAuthor", { errors: errors.array() });
		}

		try {
			const { name_author } = req.body;
			console.log(name_author);

			await postAuthor(name_author);
			res.redirect("/manhwa/add");
		} catch (err) {
			return res.render("pages/addAuthor", {
				errors: [{ msg: "Author name is already exists" }],
			});
		}
	},
];
