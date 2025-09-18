import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AnunturileMele() {
  const [anunturi, setAnunturi] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Încarcă anunțurile utilizatorului logat
  useEffect(() => {
    const fetchAnunturi = async () => {
      try {
        const response = await fetch(
          "https://imobila-market.onrender.com/api/anunturile-mele",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
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

  // 🗑️ Ștergere anunț
  const stergeAnunt = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest anunț?")) return;

    try {
      const response = await fetch(
        `https://imobila-market.onrender.com/api/anunturi/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Eroare la ștergerea anunțului");
      }

      // Elimină din listă fără reload
      setAnunturi(anunturi.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // ✏️ Editare anunț
  const editeazaAnunt = (id) => {
    navigate(`/editare/${id}`);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h2>📋 Anunțurile Mele (Editare + Ștergere)</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {anunturi.length === 0 ? (
        <p>Nu ai niciun anunț adăugat.</p>
      ) : (
        <div>
          {anunturi.map((anunt) => (
            <div
              key={anunt._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{anunt.titlu}</h3>
              <p>{anunt.descriere}</p>
              <p>
                <b>Preț:</b> {anunt.pret} €
              </p>
              <p>
                <b>Categorie:</b> {anunt.categorie}
              </p>

              {/* ✏️ Buton Editare */}
              <button
                onClick={() => editeazaAnunt(anunt._id)}
                style={{
                  marginRight: "10px",
                  padding: "8px 12px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ✏️ Editează
              </button>

              {/* 🗑️ Buton Ștergere */}
              <button
                onClick={() => stergeAnunt(anunt._id)}
                style={{
                  padding: "8px 12px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                🗑️ Șterge
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnunturileMele;
