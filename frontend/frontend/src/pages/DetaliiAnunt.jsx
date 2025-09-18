import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DetaliiAnunt() {
  const { id } = useParams(); // luăm ID-ul din URL
  const navigate = useNavigate();
  const [anunt, setAnunt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnunt = async () => {
      try {
        const response = await fetch(
          `https://imobila-market.onrender.com/api/anunturi/${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setAnunt(data);
        } else {
          setError(data.error || "Eroare la încărcarea anunțului");
        }
      } catch (err) {
        setError("Eroare server");
      }
    };

    fetchAnunt();
  }, [id]);

  if (error) {
    return (
      <div style={{ maxWidth: "600px", margin: "50px auto", color: "red" }}>
        ❌ {error}
      </div>
    );
  }

  if (!anunt) {
    return (
      <div style={{ maxWidth: "600px", margin: "50px auto" }}>
        <p>Se încarcă detaliile anunțului...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>{anunt.titlu}</h2>
      {anunt.imagine && (
        <img
          src={`https://imobila-market.onrender.com${anunt.imagine}`}
          alt={anunt.titlu}
          style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }}
        />
      )}
      <p>
        <b>Descriere:</b> {anunt.descriere}
      </p>
      <p>
        <b>Preț:</b> {anunt.pret} €
      </p>
      <p>
        <b>Categorie:</b> {anunt.categorie}
      </p>

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 15px",
          marginTop: "15px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ⬅️ Înapoi
      </button>
    </div>
  );
}

export default DetaliiAnunt;
