import React, { useEffect, useState } from "react";
import axios from "axios";
import GlobalView from "../components/GlobalView";

const InvoiceCreate = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [types, setTypes] = useState([]);
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [invoice, setInvoice] = useState({
		title: "",
		date: "",
		total_ttc: "",
		type_id: "",
	});

	useEffect(() => {
		const fetchTypes = async () => {
			try {
				const response = await axios.get("http://52.90.40.101:3333/api/types");
				setTypes(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchTypes();
	}, []);

	const handleChange = (e) => {
		setInvoice({ ...invoice, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e) => {
		setImage(e.target.files[0]);
	};

	const handleFileSubmit = async () => {
		if (!image) {
			alert("Veuillez sélectionner un fichier.");
			return;
		}

		const formData = new FormData();
		formData.append("image", image);

		setLoading(true);

		const response = await axios.post(
			"http://52.90.40.101:3333/api/analyze",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		const { title, date, total_ttc, type_id } = response.data.facture;
		const formattedDate = date ? date : null;
		const formattedTypeId = type_id ? type_id.toString() : null;

		setInvoice({
			title: title || null,
			date: formattedDate,
			total_ttc: total_ttc || null,
			type_id: formattedTypeId,
		});

		setLoading(false);

		setCurrentStep(2);
	};

	const handleNextStepWithoutFile = () => {
		setCurrentStep(2);
	};

	const createInvoice = async () => {
		const formData = new FormData();
		formData.append("image", image);
		formData.append("title", invoice.title);
		formData.append("date", invoice.date);
		formData.append("total_ttc", invoice.total_ttc);
		formData.append("type_id", invoice.type_id);

		try {
			await axios.post("http://52.90.40.101:3333/api/invoices/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			// Redirection après la création
			window.location.href = "/";
		} catch (error) {
			console.error("Erreur lors de la création de la facture :", error);
			alert("Une erreur s'est produite lors de la création de la facture.");
		}
	};

	return (
		<main className="page">
			<div className="main-container">
				<div className="relative overflow-x-auto">
					<h1 className="mb-4 title">Création d'une facture</h1>
					<div className="bg-white rounded p-5">
						{currentStep === 1 && (
							<>
								<form className="max-w-sm mx-auto">
									<div className="sm:col-span-3 mb-4">
										<label className="block text-sm font-medium leading-6 text-gray-900">
											Fichier
										</label>
										<div className="mt-2">
											<input
												type="file"
												onChange={handleFileChange}
												className="block w-full"
											/>
										</div>
									</div>
									<button
										type="button"
										onClick={handleFileSubmit}
										className="button bg-black hover:bg-blue-700 text-white font-bold p-2 px-4 rounded-full text-center"
									>
										Suivant
									</button>
									<button
										type="button"
										onClick={handleNextStepWithoutFile}
										className="button text-black font-bold p-2 px-4 rounded-full text-center"
									>
										Continuer sans image
									</button>
								</form>
								<div className={loading ? "lds-ring visible" : "lds-ring invisible"}>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
							</>
						)}
						{currentStep === 2 && (
							<form className="max-w-sm mx-auto">
								<div className="sm:col-span-3 mb-2">
									<label
										htmlFor="title"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Titre
									</label>
									<div className="mt-2">
										<input
											type="text"
											name="title"
											id="title"
											onChange={handleChange}
											value={invoice.title}
											className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
								<div className="sm:col-span-3 mb-2">
									<label
										htmlFor="date"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Date
									</label>
									<div className="mt-2">
										<input
											type="date"
											name="date"
											id="date"
											onChange={handleChange}
											value={invoice.date}
											className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
								<div className="sm:col-span-3 mb-2">
									<label
										htmlFor="total_ttc"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Total TTC
									</label>
									<div className="mt-2">
										<input
											type="number"
											name="total_ttc"
											onChange={handleChange}
											id="total_ttc"
											value={invoice.total_ttc}
											className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
								<div className="sm:col-span-3 mb-4">
									<label
										htmlFor="type_id"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Type
									</label>
									<div className="mt-2">
										<select
											name="type_id"
											onChange={handleChange}
											id="type_id"
											className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										>
											<option value="">Sélectionnez une catégorie</option>
											{types.map((type) => (
												<option
													key={type._id}
													value={type._id}
													selected={invoice.type_id === type._id}
												>
													{type.name}
												</option>
											))}
										</select>
									</div>
								</div>
								<button
									type="button"
									onClick={createInvoice}
									className="button bg-black hover:bg-blue-700 text-white font-bold p-2 px-4 rounded-full text-center"
								>
									Créer
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
			<div className="right-container">
				<GlobalView />
			</div>
		</main>
	);
};

export default InvoiceCreate;
