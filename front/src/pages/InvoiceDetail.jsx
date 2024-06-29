import React, { useEffect, useState } from "react";
import axios from "axios";
import sha1 from "crypto-js/hmac-sha1";
import Table from "../components/Tools/Table";
import { NavLink } from "react-router-dom";
import GlobalView from "../components/GlobalView";

const InvoiceDetail = () => {
	const [dataFetched, setDataFetched] = useState(false);
	const [data, setData] = useState([]);
	const [invoice, setInvoice] = useState({});

	const [types, setTypes] = useState([]);

	const [image, setImage] = useState(null);

	const handleFileChange = (e) => {
		setImage(e.target.files[0]);
	};

	const fetchInvoice = async () => {
		try {
			let id = window.location.pathname.split("/")[2];
			const response = await axios.get(
				"http://52.90.40.101:3333/api/invoices/" + id
			);
			setInvoice(response.data);
			setDataFetched(true);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchTypes = async () => {
		try {
			const response = await axios.get("http://52.90.40.101:3333/api/types");
			setTypes(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const editInvoice = async () => {
		try {
			let id = window.location.pathname.split("/")[2];
			const response = await axios.put(
				"http://52.90.40.101:3333/api/invoices/" + id,
				invoice
			);
			setInvoice(response.data);
			setDataFetched(true);

			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	const handleChange = (e) => {
		setInvoice({ ...invoice, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		fetchInvoice();
		fetchTypes();
	}, []);

	return (
		<main className="page">
			<div className="main-container">
				<div className="relative overflow-x-auto">
					<h1 className="mb-4 title">Modification d'une facture</h1>
					{/* form with all fields of invoice */}
					<div className="bg-white rounded p-5">
						<form className="max-w-sm mx-auto">
							<div className="sm:col-span-3 mb-2">
								<label
									for="title"
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
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>
							<div className="sm:col-span-3  mb-2">
								<label
									for="date"
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
										value={invoice.date ? invoice.date.substring(0, 10) : ""}
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>
							<div className="sm:col-span-3  mb-2">
								<label
									for="total_ttc"
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
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>
							{/* category est un select avec le name et l'id en value */}
							<div className="sm:col-span-3  mb-4">
								<label
									for="type_id"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Type
								</label>
								<div className="mt-2">
									<select
										name="type_id"
										onChange={handleChange}
										id="type_id"
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									>
										{types.map((type) => (
											<option
												value={type._id}
												selected={type._id === invoice.type_id}
											>
												{type.name}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* button edit invoice */}
							<div>
								<div
									onClick={editInvoice}
									className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-50 text-center"
								>
									Editer
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className="right-container">
				<GlobalView />
			</div>
		</main>
	);
};

export default InvoiceDetail;
