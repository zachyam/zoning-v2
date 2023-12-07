import "./App.css";
import React from "react";

import EditCodeRegulationsPage from "./components/EditCodeRegulationsPage";
import EditZonesPage from "./components/EditZonesPage";
import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "tabler-react/dist/Tabler.css";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/EditCodeRegulationsPage" element={<EditCodeRegulationsPage />} />
        <Route path="/EditZonesPage" element={<EditZonesPage />} />
      </Routes>
    </Router>
    
  );
}