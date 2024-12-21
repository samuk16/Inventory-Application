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
	deleteManhwa,
	getHashPass,
} from "../db/queries";
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { error } from "node:console";

type ScryptAsync = (
	password: string,
	salt: string,
	keylen: number,
) => Promise<Buffer>;
const scryptAsync = promisify(scrypt) as ScryptAsync;

export class PasswordService {
	private readonly keyLength = 16;
	async hashPassword(password: string): Promise<string> {
		const salt = randomBytes(16).toString("hex");
		const buffer: Buffer = await scryptAsync(password, salt, this.keyLength);
		return `${salt}:${buffer.toString("hex")}`;
	}

	async verifyPassword(password: string, hash: string): Promise<boolean> {
		try {
			const [salt, hashedPassword] = hash.split(":");
			const buffer: Buffer = await scryptAsync(password, salt, this.keyLength);
			const storedHashBuffer = Buffer.from(hashedPassword, "hex");

			return timingSafeEqual(buffer, storedHashBuffer);
		} catch (err) {
			console.error("Error in verifyPassword", err);
			return false;
		}
	}
}

const passwordService = new PasswordService();

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
	// console.log(manhwa);
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
		.notEmpty()
		.withMessage("Title manhwa is required")
		// .matches(/^[a-zA-Z0-9\s]+$/)
		.isString()
		.withMessage(`Title manhwa ${alphaErr}`)
		.isLength({ min: 2, max: 255 })
		.withMessage(`Title manhwa ${lenghtErr}`),
	body("description")
		.trim()
		.isLength({ min: 2, max: 600 })
		.withMessage("Description must be between 2 and 600 characters"),
	body("caps")
		.trim()
		.isNumeric()
		.withMessage("Caps must be a number")
		.isLength({ min: 1, max: 255 })
		.withMessage("Caps is required"),
	body("urlImage").trim().optional(),
	// .isLength({ min: 2, max: 255 })
	// .withMessage("Url image is required"),
	body("passManhwa")
		.trim()
		.isLength({ min: 2, max: 255 })
		.withMessage("Password is required"),
];

interface Manhwa {
	name_manhwa: string;
	description: string;
	caps: number;
	urlImage: string;
	author: number;
	tags: number[];
	passManhwa: string;
}
export const postManhwaC = [
	validatorManhwaForm,
	async (req: Request, res: Response) => {
		const newManhwa: Manhwa = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const authors = await getAllAuthors();
			const tags = await getAllTags();
			return res.render("pages/addManhwa", {
				newManhwa,
				authors,
				tags,
				errors: errors.array(),
			});
		}
		const {
			name_manhwa,
			description,
			caps,
			urlImage,
			tags,
			author,
			passManhwa,
		}: Manhwa = req.body;

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

		const passHashed = await passwordService.hashPassword(passManhwa);

		await postManhwa(
			name_manhwa,
			description,
			caps,
			urlImage,
			author,
			passHashed,
		);
		const manhwaId = await getManhwaId(name_manhwa);
		await postManhwasTags(tags, manhwaId[0].id);

		res.redirect("/");
	},
];

const validatorPassManhwa = [
	body("passManhwa")
		.trim()
		.isLength({ min: 2, max: 255 })
		.withMessage("Password is required"),
];

export const deleteManhwaC = [
	validatorPassManhwa,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		const manhwaId = req.params.id;

		if (!errors.isEmpty()) {
			const manhwa = await getManhwaWithId(Number.parseInt(manhwaId));
			const nameTags = await getTagsNameOfManhwa(Number.parseInt(manhwaId));
			return res.render("pages/manhwaView", {
				manhwa: manhwa[0],
				nameTags,
				errors: errors.array(),
			});
		}

		const { passManhwa } = req.body;
		const passwordHashed = await getHashPass(manhwaId);
		const booleanPass = await passwordService.verifyPassword(
			passManhwa,
			passwordHashed[0].password,
		);
		if (!booleanPass) {
			const manhwa = await getManhwaWithId(Number.parseInt(manhwaId));
			const nameTags = await getTagsNameOfManhwa(Number.parseInt(manhwaId));
			return res.render("pages/manhwaView", {
				manhwa: manhwa[0],
				nameTags,
				errors: [{ msg: "Password incorrect" }],
			});
		}
		await deleteManhwa(Number.parseInt(manhwaId));
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
			return res.render("pages/editManhwa", {
				manhwa: manhwa[0],
				authors,
				tags,
				tagsOfManhwaIds,
				errors: errors.array(),
			});
		}
		const manhwaId = req.params.id;
		const {
			name_manhwa,
			description,
			caps,
			urlImage,
			tags,
			author,
			passManhwa,
		}: Manhwa = req.body;

		const hashPassword = await getHashPass(manhwaId);
		const booleanPass = await passwordService.verifyPassword(
			passManhwa,
			hashPassword[0].password,
		);
		if (!booleanPass) {
			const manhwaId = req.params.id;
			const authors = await getAllAuthors();
			const tags = await getAllTags();
			const tagsOfManhwa = await getTagsIdOfManhwa(Number.parseInt(manhwaId));
			const tagsOfManhwaIds = tagsOfManhwa.map((tag: { id: number }) => tag.id);
			const manhwa = await getManhwaWithId(Number.parseInt(manhwaId));
			// console.log(manhwa);
			return res.render("pages/editManhwa", {
				manhwa: manhwa[0],
				authors,
				tags,
				tagsOfManhwaIds,
				errors: [{ msg: "Password is incorrect" }],
			});
		}
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
