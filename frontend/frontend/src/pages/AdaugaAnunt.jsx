import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdaugaAnunt() {
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [pret, setPret] = useState("");
  const [categorie, setCategorie] = useState("");
  const [imagine, setImagine] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("titlu", titlu);
      formData.append("descriere", descriere);
      formData.append("pret", pret);
      formData.append("categorie", categorie);
      if (imagine) {
        formData.append("imagine", imagine);
      }

      const response = await fetch(
        "https://imobila-market.onrender.com/api/anunturi",
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"), // 🔑 trimitem token
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Eroare la adăugarea anunțului");
      }

      setSuccess("✅ Anunț adăugat cu succes!");
      setTitlu("");
      setDescriere("");
      setPret("");
      setCategorie("");
      setImagine(null);

      // Redirect la homepage după 2 secunde
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Adaugă Anunț</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Titlu:</label>
          <input
            type="text"
            value={titlu}
            onChange={(e) => setTitlu(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Descriere:</label>
          <textarea
            value={descriere}
            onChange={(e) => setDescriere(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", minHeight: "100px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Preț:</label>
          <input
            type="number"
            value={pret}
            onChange={(e) => setPret(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Categorie:</label>
          <input
            type="text"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Imagine:</label>
          <input
            type="file"
            onChange={(e) => setImagine(e.target.files[0])}
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 15px" }}>
          Adaugă
        </button>
      </form>
    </div>
  );
}

export default AdaugaAnunt;
