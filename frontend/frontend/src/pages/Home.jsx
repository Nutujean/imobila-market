import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [anunturi, setAnunturi] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Încarcă toate anunțurile
  useEffect(() => {
    const fetchAnunturi = async () => {
      try {
        const response = await fetch(
          "https://imobila-market.onrender.com/api/anunturi"
        );
        const data = await response.json();
        if (response.ok) {
          setAnunturi(data);
        } else {
          setError(data.error || "Eroare la încărcarea anunțurilor");
        }
      } catch (err) {
        setError("Eroare server");
      }
    };

    fetchAnunturi();
  }, []);

  if (error) {
    return (
      <div style={{ maxWidth: "800px", margin: "50px auto", color: "red" }}>
        ❌ {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "50px auto" }}>
      <h2>Acasă</h2>

      {anunturi.length === 0 ? (
        <p>Nu există anunțuri momentan.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {anunturi.map((anunt) => (
            <div
              key={anunt._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                background: "#fafafa",
              }}
            >
              <h3>{anunt.titlu}</h3>
              {anunt.imagine && (
                <img
                  src={`https://imobila-market.onrender.com${anunt.imagine}`}
                  alt={anunt.titlu}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              )}
              <p>{anunt.descriere}</p>
              <p>
                <b>Preț:</b> {anunt.pret} €
              </p>
              <p>
                <b>Categorie:</b> {anunt.categorie}
              </p>

              <button
                onClick={() => navigate(`/detalii/${anunt._id}`)}
                style={{
                  padding: "8px 12px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                🔍 Detalii
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
