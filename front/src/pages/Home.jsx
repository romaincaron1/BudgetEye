import React, { useEffect, useState } from "react";
import axios from "axios";
import sha1 from 'crypto-js/hmac-sha1';
import Table from "../components/Tools/Table";
import { NavLink } from "react-router-dom";
import GlobalView from "../components/GlobalView";

const Home = () => {

    const [dataFetched, setDataFetched] = useState(false);
    const [data, setData] = useState([]);
  
      const fetchInvoices = async () => {
          try {
              const response = await axios.get('http://52.90.40.101:3333/api/invoices');
  
              let datatest = response.data.map(obj => {
                  return [
                      obj.title,
                        new Date(obj.date).toLocaleDateString(),
                        obj.total_ttc + "€",
                        obj.type_id ? (
                            <span className="badge" style={{ background: obj.type_id.color }}>{obj.type_id.name}</span>
                        ) : 'Non classé',
                      <>
                        <NavLink className="button edit" to={"/invoices/" + obj._id}>
                            <span className="material-icons">edit</span>
                        </NavLink>
                        <span onClick={() => deleteInvoice(obj._id)} className="material-icons cursor-pointer">delete</span>
                        <span onClick={() => archiveInvoice(obj._id)}  className="material-icons cursor-pointer">archive</span>
                        { obj.image_url ? <span onClick={() => seeInvoice(obj._id)}  className="material-icons cursor-pointer">visibility</span> : '' }

                    </>
                  ];
              });
              setData(datatest);
              setDataFetched(true);
          } catch (error) {
              console.error(error);
          }
      }

      const columns = [
        { name: "Facture", options: { filterOptions: { fullWidth: true } } },
        { name: "Date", options: { filterOptions: { fullWidth: true } } },
        { name: "Total TTC", options: { filterOptions: { fullWidth: true } } },
        { name: "Type", options: { filterOptions: { fullWidth: true } } },
        { name: "Actions", options: { filter: false, sort: false } }
      ];

      const deleteInvoice = async (id) => {
        // alert
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette facture?")) {
            return;
        }

        try {
            await axios.delete('http://52.90.40.101:3333/api/invoices/' + id);
            window.location.reload();

        } catch (error) {
            console.error(error);
        }
    }

    // archiveInvoice
    const archiveInvoice = async (id) => {
        // alert
        if (!window.confirm("Êtes-vous sûr de vouloir archiver cette facture?")) {
            return;
        }

        try {
            await axios.get('http://52.90.40.101:3333/api/invoices/archive/' + id);
            window.location.reload();

        } catch (error) {
            console.error(error);
        }
    }

    const seeInvoice = async (id) => {
        try {
            const response = await axios.get('http://52.90.40.101:3333/api/invoices/' + id);
            //  redirect to home
            window.open('http://52.90.40.101:3333/' + response.data.image_url, '_blank');

        } catch (error) {
            console.error(error);
        }
    }


    


    useEffect(() => {
        fetchInvoices();
    }, []);
    


  return (
    <main className="page">
        <div className="main-container">

                <div className="flex justify-items-center items-center justify-between mb-4">
                    <h1 className="mb-4 title" >Mes factures</h1>

                    <NavLink className="button btn-black" to={"/invoices/archive"}>
                        Voir les archives
                    </NavLink>
                </div>
                
                
                {dataFetched ? <Table data={data} columns={columns}  /> : <p>Loading...</p>}
                
        </div>
        <div className="right-container">
            <h1 className="mb-4 title" >Importer une facture</h1>
            <div className="bg-white flex flex-col justify-items-center items-center p-5 rounded-md">
                {/* drag and drop logo */}
                <div className="flex flex-col justify-items-center items-center">
                <img src="https://img.icons8.com/ios/452/upload-to-cloud.png" alt="logo" className="w-32 h-32" />
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

export default Home;