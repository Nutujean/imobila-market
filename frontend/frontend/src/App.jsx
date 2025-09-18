import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// importăm paginile
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AnunturileMele from "./pages/AnunturileMele";
import AdaugaAnunt from "./pages/AdaugaAnunt";
import EditareAnunt from "./pages/EditareAnunt";
import DetaliiAnunt from "./pages/DetaliiAnunt";

function App() {
  return (
    <Router>
      {/* 🔹 Navbar simplu */}
      <nav
        style={{
          padding: "10px",
          background: "#f8f9fa",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
        }}
      >
        <Link to="/" style={{ marginRight: "15px" }}>
          🏠 Acasă
        </Link>
        <Link to="/adauga" style={{ marginRight: "15px" }}>
          ➕ Adaugă anunț
        </Link>
        <Link to="/anunturile-mele" style={{ marginRight: "15px" }}>
          📋 Anunțurile Mele
        </Link>
        <Link to="/login" style={{ marginRight: "15px" }}>
          🔑 Login
        </Link>
        <Link to="/register">🆕 Register</Link>
      </nav>

      {/* 🔹 Rute */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/anunturile-mele" element={<AnunturileMele />} />
        <Route path="/adauga" element={<AdaugaAnunt />} />
        <Route path="/editare/:id" element={<EditareAnunt />} />
        <Route path="/detalii/:id" element={<DetaliiAnunt />} />
      </Routes>
    </Router>
  );
}

export default App;
