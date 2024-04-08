import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const GlobalView = () => {

    const [invoices, setInvoices] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [summaries, setSummaries] = useState([]);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://localhost:3333/api/invoices');
            setInvoices(response.data);
            calculateTotalAmount(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchSummaries = async () => {
        try {
            const response = await axios.get('http://localhost:3333/api/summaries');
            setSummaries(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const calculateTotalAmount = (invoices) => {
        let total = 0;
        invoices.forEach(invoice => {
            total += invoice.total_ttc;
        });
        setTotalAmount(total);
    }

    useEffect(() => {
        fetchInvoices();
        fetchSummaries();
    }
    , []);

    return (
        <>
            <h1 className="mt-5 mb-5 title" >Vue d'ensemble</h1>
            <div className="flex flex-col  gap-2">
                <div className="bg-white rounded flex gap-2 p-3">
                    <div className=" bg-red-500 rounded flex justify-items-center items-center p-2">
                        <span className="material-icons text-white">receipt</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs">Nombre de factures</span>
                        <span className="font-bold">{invoices.length}</span>
                    </div>
                </div>
                <div className="bg-white rounded flex gap-2 p-3">
                    <div className=" bg-green-500 rounded flex justify-items-center items-center p-2">
                        <span className="material-icons text-white">paid</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs">Montant total des factures</span>
                        <span className="font-bold">{totalAmount}€</span>
                    </div>
                </div>
                <div className="bg-white rounded flex gap-2 p-3">
                    <div className=" bg-blue-400 rounded flex justify-items-center items-center p-2">
                        <span className="material-icons text-white">receipt</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs">Nombre de bilan générés</span>
                        <span className="font-bold">{summaries.length}</span>
                    </div>
                </div>
            </div>
            </>
    );
};

export default GlobalView;