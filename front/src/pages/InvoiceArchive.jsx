import React, { useEffect, useState } from "react";
import axios from "axios";
import sha1 from "crypto-js/hmac-sha1";
import Table from "../components/Tools/Table";
import { NavLink } from "react-router-dom";
import GlobalView from "../components/GlobalView";

const InvoiceArchive = () => {
	const [dataFetched, setDataFetched] = useState(false);
	const [data, setData] = useState([]);

	// fetch invoices from api 'http://localhost:3333/api/invoices'

	const fetchInvoices = async () => {
		try {
			const response = await axios.get(
				"http://localhost:3333/api/invoices?archived=true"
			);

			let datatest = response.data.map((obj) => {
				return [
					obj.title,
					new Date(obj.date).toLocaleString(),
					obj.total_ttc + "€",
					obj.type_id ? obj.type_id.name : "Non classé",
					<>
						<NavLink className={"button"} to={"/invoices/" + obj._id}>
							<span className="material-icons">edit</span>
						</NavLink>
						<span
							onClick={() => deleteInvoice(obj._id)}
							className="material-icons cursor-pointer"
						>
							delete
						</span>
						<span
							onClick={() => archiveInvoice(obj._id)}
							className="material-icons cursor-pointer"
						>
							archive
						</span>
					</>,
				];
			});
			setData(datatest);
			setDataFetched(true);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteInvoice = async (id) => {
		// alert
		if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette facture?")) {
			return;
		}

		try {
			await axios.delete("http://localhost:3333/api/invoices/" + id);
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	// archiveInvoice
	const archiveInvoice = async (id) => {
		// alert
		if (
			!window.confirm("Êtes-vous sûr de vouloir désarchiver cette facture?")
		) {
			return;
		}

		try {
			await axios.get("http://localhost:3333/api/invoices/unarchive/" + id);
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	const columns = [
		{ name: "Facture", options: { filterOptions: { fullWidth: true } } },
		{ name: "Date", options: { filterOptions: { fullWidth: true } } },
		{ name: "Total TTC", options: { filterOptions: { fullWidth: true } } },
		{ name: "Type", options: { filterOptions: { fullWidth: true } } },
		{ name: "Actions", options: { filter: false, sort: false } },
	];

	useEffect(() => {
		fetchInvoices();
	});

	return (
		<main className="page">
			<div className="main-container">
				<div className="flex justify-items-center items-center justify-between mb-4">
					<h1 className="mb-4 title">Mes factures archivé</h1>

					<NavLink className="btn-black" to={"/"}>
						Voir les factures non archivé
					</NavLink>
				</div>

				{dataFetched ? (
					<Table data={data} columns={columns} />
				) : (
					<p>Loading...</p>
				)}
			</div>
			<div className="right-container">
				<h1 className="mb-4 title">Importer une facture</h1>
				<div className="bg-white flex flex-col justify-items-center items-center p-5 rounded-md">
					{/* drag and drop logo */}
					<div className="flex flex-col justify-items-center items-center">
						<img
							src="https://img.icons8.com/ios/452/upload-to-cloud.png"
							alt="logo"
							className="w-32 h-32"
						/>
					</div>

					<NavLink className="btn-black" to={"/invoices/create"}>
						Importer une facture
					</NavLink>
				</div>
				<GlobalView />
			</div>
		</main>
	);
};

export default InvoiceArchive;
