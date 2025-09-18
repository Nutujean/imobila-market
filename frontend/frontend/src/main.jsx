import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";   // 🔹 Importăm App.jsx corect
import "./index.css";          // 🔹 Stilurile globale (poți lăsa sau șterge dacă nu le folosești)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
