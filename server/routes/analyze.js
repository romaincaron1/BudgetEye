const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { OpenAI } = require("openai");
const { Type } = require("../models/type");
const sharp = require("sharp"); // Importer sharp

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/uploads/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		// Vérifier si un fichier a été téléchargé
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			// Si aucun fichier image n'est téléchargé, continuer la requête sans erreur
			req.noImage = true;
		}
		cb(null, true);
	},
});

router.post("/", upload.single("image"), async (req, res) => {
	const image = req.file;

	const types = await Type.find();
	let typeNames = "";
	types.forEach((type) => {
		typeNames += type.name + ": " + type._id.toString() + " ";
	});

	if (!image) {
		return res.status(400).send({ error: "No file uploaded" });
	}

	// Chemin complet du fichier
	const filePath = path.resolve(__dirname, "../public/uploads", image.filename);

	// Redimensionner l'image avec sharp
	try {
		await sharp(filePath).resize({ width: 200 }).toFile(`${filePath}-resized`);

		const resizedFilePath = `${filePath}-resized`;

		// Lire le fichier redimensionné en utilisant fs
		fs.readFile(resizedFilePath, async (err, data) => {
			if (err) {
				return res.status(500).send({ error: "Failed to read file" });
			}

			const base64Image = data.toString("base64");

			fs.unlink(resizedFilePath, (err) => {
				if (err) {
					console.error("Failed to delete temporary file", err);
				}
			});

			const openai = new OpenAI({
				apiKey: process.env.OPENAI_API_KEY,
			});

			try {
				const prompt = `
                Envoie uniquement le contenu de la facture en JSON. Pas de caractère parasite.
                Il faut que tu me renvoies un JSON contenant un objet facture avec les propriétés suivantes :
                - title: nom du lieu ou de l'établissement où la facture a été générée (UTF-8)
                - date: date de la facture au format YYYY-MM-DD
                - total_ttc: montant total TTC de la facture (nombre décimal)
                - type_id: identifiant du type de la facture, correspondant à l'un des types suivants : ${typeNames}
                Assure-toi que les informations renvoyées sont correctes et correspondent exactement aux détails de la facture. Par exemple, si la facture provient d'un restaurant comme McDonald's, le titre devrait être "McDonald's", et le type devrait correspondre au type de transaction, comme "Nourriture", et non "Essence".
                
        `;

				const openAiResponse = await openai.chat.completions.create({
					model: "gpt-4o",
					messages: [
						{
							role: "user",
							content: [
								{ type: "text", text: prompt },
								{
									type: "image_url",
									image_url: {
										url: `data:${image.mimetype};base64,${base64Image}`,
									},
								},
							],
						},
					],
				});

				const response = extractAndParseJSON(
					openAiResponse.choices[0].message.content
				);
				res.send(response);
			} catch (error) {
				console.error("Failed to call OpenAI API", error);
				res.status(500).send({ error: "Failed to call OpenAI API" });
			}
		});
	} catch (error) {
		console.error("Failed to resize image", error);
		res.status(500).send({ error: "Failed to resize image" });
	}
});

function extractAndParseJSON(textWithMarkdown) {
	const jsonStartIndex = textWithMarkdown.indexOf("{");
	const jsonEndIndex = textWithMarkdown.lastIndexOf("}");

	if (jsonStartIndex === -1 || jsonEndIndex === -1) {
		throw new Error("Contenu JSON non trouvé dans le texte fourni.");
	}

	const jsonContent = textWithMarkdown.substring(
		jsonStartIndex,
		jsonEndIndex + 1
	);

	const cleanedJson = jsonContent.replace(/```json\s*/, "").trim();

	try {
		const parsedJson = JSON.parse(cleanedJson);
		return parsedJson;
	} catch (error) {
		throw new Error(`Erreur lors de l'analyse du JSON : ${error.message}`);
	}
}

module.exports = router;
