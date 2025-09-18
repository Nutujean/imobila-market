import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditareAnunt() {
  const { id } = useParams(); // ID-ul anunțului din URL
  const navigate = useNavigate();

  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [pret, setPret] = useState("");
  const [categorie, setCategorie] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Preia datele anunțului curent pentru a le edita
  useEffect(() => {
    const fetchAnunt = async () => {
      try {
        const response = await fetch(
          `https://imobila-market.onrender.com/api/anunturi/${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setTitlu(data.titlu);
          setDescriere(data.descriere);
          setPret(data.pret);
          setCategorie(data.categorie);
        } else {
          setError(data.error || "Eroare la încărcarea anunțului");
        }
      } catch (err) {
        setError("Eroare server");
      }
    };
    fetchAnunt();
  }, [id]);

  // ✅ Trimite modificările
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `https://imobila-market.onrender.com/api/anunturi/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token"), // 🔑 trimitem tokenul
          },
          body: JSON.stringify({ titlu, descriere, pret, categorie }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Eroare la modificarea anunțului");
      }

      setSuccess("✅ Anunț modificat cu succes!");
      setTimeout(() => navigate("/anunturile-mele"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>Editare Anunț</h2>
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

        <button type="submit" style={{ padding: "10px 15px" }}>
          Salvează modificările
        </button>
      </form>
    </div>
  );
}

export default EditareAnunt;
