import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "../components/Tools/Table";
import GlobalView from "../components/GlobalView";

const Summary = () => {
    const [summaries, setSummaries] = useState([]);
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");

    const fetchSummaries = async () => {
        try {
            const response = await axios.get('http://52.90.40.101:3333/api/summaries');

            let datatest = response.data.map(obj => {
                return [
                    new Date(obj.start_date).toLocaleDateString() + " - " + new Date(obj.end_date).toLocaleDateString(),
                    new Date(obj.generated_date).toLocaleDateString(),
                    <>
                        <span onClick={() => seeSummary(obj.pdf_link)} className="material-icons cursor-pointer">
                            download
                        </span>
                        <span onClick={() => deleteSummary(obj._id)} className="material-icons cursor-pointer">delete</span>
                    </>
                ];
            });
            setData(datatest);

            setSummaries(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteSummary = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce bilan?")) {
            return;
        }

        try {
            await axios.delete(`http://52.90.40.101:3333/api/summaries/${id}`);
            fetchSummaries();
        } catch (error) {
            console.error(error);
        }
    };

    const seeSummary = (link) => {
        window.open(link, '_blank');
    };

    const columns = [
        { name: "Période", options: { filterOptions: { fullWidth: true } } },
        { name: "Date de la génération", options: { filterOptions: { fullWidth: true } } },
        { name: "Actions", options: { filter: false, sort: false } }
    ];

    useEffect(() => {
        fetchSummaries();
    }, []);

    const generateMonthlySummary = async () => {
        await axios.post('http://52.90.40.101:3333/api/summaries', {
            start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            end_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            generated_date: new Date(),
        });

        fetchSummaries();
    };

    const generateLastSixMonthsSummary = async () => {
        await axios.post('http://52.90.40.101:3333/api/summaries', {
            start_date: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1),
            end_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            generated_date: new Date(),
        });

        fetchSummaries();
    };

    const handleCustomSummarySubmit = async (event) => {
        event.preventDefault();
        await axios.post('http://52.90.40.101:3333/api/summaries', {
            start_date: customStartDate,
            end_date: customEndDate,
            generated_date: new Date(),
        });

        setIsModalOpen(false);
        fetchSummaries();
    };

    return (
        <main className="page">
            <div className="main-container">
                <div className="flex justify-items-center items-center justify-between mb-4">
                    <h1 className="mb-4 title">Mes bilans</h1>
                </div>
                {data ? <Table data={data} columns={columns} /> : <p>Loading...</p>}
            </div>
            <div className="right-container">
                <h1 className="mb-4 title">Générer un bilan</h1>
                <div className="bg-white flex flex-col justify-items-center items-center p-5 rounded-md">
                    <button onClick={generateMonthlySummary} className="btn-black" style={{ width: "200px" }}>
                        Ce mois-ci
                    </button>
                    <button onClick={generateLastSixMonthsSummary} className="btn-black my-3" style={{ width: "200px" }}>
                        Les 6 derniers mois
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="btn-black" style={{ width: "200px" }}>
                        Durée personnalisée
                    </button>
                </div>
                <GlobalView />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Sélectionner les Dates</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleCustomSummarySubmit}>
                            <div className="mb-4">
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Date de Début</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Date de Fin</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Annuler
                                </button>
                                <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                                    Soumettre
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Summary;
