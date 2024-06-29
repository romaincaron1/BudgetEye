import React, { useEffect, useState } from "react";
import axios from "axios";
import sha1 from "crypto-js/hmac-sha1";
import Table from "../components/Tools/Table";
import { NavLink } from "react-router-dom";
import GlobalView from "../components/GlobalView";
const Category = () => {
	const [dataFetched, setDataFetched] = useState(false);
	const [data, setData] = useState([]);
	const [invoices, setInvoices] = useState([]);

	const [type, setType] = useState({
		name: "",
		color: "",
		treshold: "",
	});

	// fetch invoices from api 'http://52.90.40.101:3333/api/invoices'

	const fetchTypes = async () => {
		try {
			const response = await axios.get("http://52.90.40.101:3333/api/types");
			console.log("get type",response)
			// Modifiez votre tableau de données pour utiliser la fonction renderThresholdComparison
			const datatest = response.data.map((obj) => {
				return [
					obj.name,
					// bordur bottom avec la couleur
					<div
						style={{ borderBottom: "2px solid " + obj.color, width: "30%" }}
					></div>,
					renderThresholdComparison(obj._id, obj.treshold),
					<span
						onClick={() => deleteType(obj._id)}
						className="material-icons cursor-pointer"
					>
						delete
					</span>,
				];
			});
			setData(datatest);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchInvoices = async () => {
		try {
			const response = await axios.get("http://52.90.40.101:3333/api/invoices");
			setInvoices(response.data);
		} catch (error) {
			console.error("Failed to fetch invoices:", error);
		}
	};

	const handleChange = (e) => {
		setType({ ...type, [e.target.name]: e.target.value });
	};

	const columns = [
		{ name: "Catégorie", options: { filterOptions: { fullWidth: true } } },
		{ name: "Couleur", options: { filterOptions: { fullWidth: true } } },
		{ name: "Seuil", options: { filterOptions: { fullWidth: true } } },
		{ name: "Actions", options: { filter: false, sort: false } },
	];

	const deleteType = async (id) => {
		// alert
		if (
			!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie?")
		) {
			return;
		}

		try {
			await axios.delete("http://52.90.40.101:3333/api/types/" + id);
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	// create type

	const createType = async () => {
		try {
			// set a random HEX color like #FFFFFF
			let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
			setType({ ...type, color: randomColor });

			let newType = {
				name: type.name,
				color: randomColor,
				treshold: type.treshold,
			};

			const response = await axios.post(
				"http://52.90.40.101:3333/api/types",
				newType
			);
			setType(response.data);
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	const calculateTotalPerCategory = (categoryId) => {
		const invoicesForCategory = invoices.filter(
			(invoice) => invoice.type_id ? invoice.type_id._id === categoryId : false
		);
		const totalAmount = invoicesForCategory.reduce(
			(total, invoice) => total + invoice.total_ttc,
			0
		);
		return totalAmount;
	};

	const renderThresholdComparison = (categoryId, threshold) => {
		const totalAmount = calculateTotalPerCategory(categoryId);

		if (!threshold) {
			threshold = "∞";
		} else {
			threshold = threshold + "€";
		}

		return `${totalAmount}€ / ${threshold}`;
	};

    useEffect(() => {
        fetchInvoices();
      }, []);
    
      useEffect(() => {
		fetchTypes();
		setDataFetched(true);
      }, [invoices]);

	return (
		<main className="page">
			<div className="main-container">
				<div className="relative overflow-x-auto">
					<h1 className="mb-4 title">Catégories de factures</h1>
					<div className="table_container">
						{/* show table when data is filled */}
						{dataFetched ? (
							<Table data={data} columns={columns} />
						) : (
							<p>Loading...</p>
						)}
					</div>
				</div>
			</div>
			<div className="right-container">
				<h1 className="mb-4 title">Ajouter une catégorie</h1>
				<div className="bg-white flex flex-col justify-items-center items-center p-5 rounded-md">
					{/* input et label */}
					<div className="flex flex-col w-full gap-2 mb-2">
						<label htmlFor="name" className="text-xs">
							Nom de la catégorie
						</label>
						<input
							onChange={handleChange}
							type="text"
							id="name"
							name="name"
							className="border p-2 rounded-md"
						/>
					</div>
					<div className="flex flex-col w-full gap-2">
						{/* seuil */}
						<label htmlFor="treshold" className="text-xs">
							Seuil
						</label>
						<input
							onChange={handleChange}
							type="number"
							id="treshold"
							name="treshold"
							className="border p-2 rounded-md"
						/>
					</div>
					<button
						onClick={createType}
						className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4"
					>
						Ajouter
					</button>
				</div>

				<GlobalView />
			</div>
		</main>
	);
};

export default Category;
