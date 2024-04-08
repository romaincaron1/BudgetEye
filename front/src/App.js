import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import './index.css';
import Home from './pages/Home';
import Category from './pages/Category';
import Sidebar from './components/Sidebar';
import InvoiceDetail from './pages/InvoiceDetail';
import InvoiceCreate from './pages/InvoiceCreate';
import InvoiceArchive from './pages/InvoiceArchive';
import Summary from './pages/Summary';

function App() {
  return (
    <BrowserRouter>
          <Sidebar/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
              <Route path="/category" element={<Category/>}></Route>
              {/* detail of a category */}
              <Route path="/invoices/:id" element={<InvoiceDetail/>}></Route>
              <Route path="/invoices/create" element={<InvoiceCreate/>}></Route>
              <Route path="/invoices/archive" element={<InvoiceArchive/>}></Route>
              <Route path="/bilans" element={<Summary/>}></Route>

        </Routes>
    </BrowserRouter>
  );
}

export default App;
