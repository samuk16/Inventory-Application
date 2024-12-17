import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
	getAllAuthors,
	getAllManhwas,
	getAllTags,
	postAuthor,
	postManhwa,
	postManhwasTags,
	getManhwaId,
	verifyTitleManhwa,
	getManhwaWithId,
	getTagsNameOfManhwa,
	getTagsIdOfManhwa,
	postUpdateManhwa,
	postUpdateManhwasTags,
	deleteManhwasTags,
} from "../db/queries";
import { promiseHooks } from "node:v8";
export async function getAddManhwaGET(req: Request, res: Response) {
	const authors = await getAllAuthors();
	const tags = await getAllTags();
	res.render("pages/addManhwa", { authors, tags });
}
export async function getManhwa(req: Request, res: Response) {
	const manhwas = await getAllManhwas();
	res.render("pages/manhwa", { manhwas });
}
export async function getManhwaView(req: Request, res: Response) {
	const manhwaId = req.params.id;
	const manhwa = await getManhwaWithId(Number.parseInt(manhwaId));
	const nameTags = await getTagsNameOfManhwa(Number.parseInt(manhwaId));
	res.render("pages/manhwaView", { manhwa: manhwa[0], nameTags });
}
export async function getManhwaEdit(req: Request, res: Response) {
	const manhwaId = req.params.id;
	const authors = await getAllAuthors();
	const tags = await getAllTags();
	const tagsOfManhwa = await getTagsIdOfManhwa(Number.parseInt(manhwaId));
	const tagsOfManhwaIds = tagsOfManhwa.map((tag: { id: number }) => tag.id);
	const manhwa = await getManhwaWithId(Number.parseInt(manhwaId));
	console.log(manhwa);
	res.render("pages/editManhwa", {
		manhwa: manhwa[0],
		authors,
		tags,
		tagsOfManhwaIds,
	});
}

// const validatorManhwaForm = [
// 	body("name_manhwa")
// 		.trim()
// 		.isAlpha()
// 		.withMessage("Name is not valid")
// 		.isLength({ min: 2, max: 255 })
// 		.withMessage("Name is required"),
// ];

const alphaErr = "must only contain letters or numbers";
const lenghtErr = "must be between 2 and 255 characters";
const validatorManhwaForm = [
	body("name_manhwa")
		.trim()
		.matches(/^[a-zA-Z0-9\s]+$/)
		.withMessage(`Title manhwa ${alphaErr}`)
		.isLength({ min: 2, max: 255 })
		.withMessage(`Title manhwa ${lenghtErr}`),
	body("description")
		.trim()
		.isLength({ min: 2, max: 255 })
		.withMessage("Description must be between 2 and 255 characters"),
	body("caps")
		.trim()
		.isNumeric()
		.withMessage("Caps must be a number")
		.isLength({ min: 1, max: 255 })
		.withMessage("Caps is required"),
	body("urlImage")
		.trim()
		.isLength({ min: 2, max: 255 })
		.withMessage("Url image is required"),
];

interface Manhwa {
	name_manhwa: string;
	description: string;
	caps: number;
	urlImage: string;
	author: number;
	tags: number[];
}
export const postManhwaC = [
	validatorManhwaForm,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const authors = await getAllAuthors();
			const tags = await getAllTags();
			return res.render("pages/addManhwa", {
				authors,
				tags,
				errors: errors.array(),
			});
		}
		const { name_manhwa, description, caps, urlImage, tags, author }: Manhwa =
			req.body;
		console.log(name_manhwa);
		console.log(tags);
		console.log(author);
		const titleRepetitive = await verifyTitleManhwa(name_manhwa);
		if (titleRepetitive.length > 0) {
			const authors = await getAllAuthors();
			const tags = await getAllTags();
			return res.render("pages/addManhwa", {
				authors,
				tags,
				errors: [{ msg: "Manhwa already exists" }],
			});
		}

		await postManhwa(name_manhwa, description, caps, urlImage, author);
		const manhwaId = await getManhwaId(name_manhwa);
		await postManhwasTags(tags, manhwaId[0].id);

		// await postAuthor(name_author);
		res.redirect("/");
	},
];

export const postUpdateManhwaC = [
	validatorManhwaForm,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const manhwaId = req.params.id;
			const authors = await getAllAuthors();
			const tags = await getAllTags();
			const tagsOfManhwa = await getTagsIdOfManhwa(Number.parseInt(manhwaId));
			const tagsOfManhwaIds = tagsOfManhwa.map((tag: { id: number }) => tag.id);
			const manhwa = await getManhwaWithId(Number.parseInt(manhwaId));
			console.log(manhwa);
			res.render("pages/editManhwa", {
				manhwa: manhwa[0],
				authors,
				tags,
				tagsOfManhwaIds,
			});
		}
		const manhwaId = req.params.id;
		const { name_manhwa, description, caps, urlImage, tags, author }: Manhwa =
			req.body;
		await postUpdateManhwa(
			name_manhwa,
			description,
			caps,
			urlImage,
			author,
			Number.parseInt(manhwaId),
		);
		await postUpdateManhwasTags(tags, Number.parseInt(manhwaId));
		await deleteManhwasTags(Number.parseInt(manhwaId), tags);
		res.redirect("/");
	},
];
