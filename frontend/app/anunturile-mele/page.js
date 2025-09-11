"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnunturileMelePage() {
  const [anunturi, setAnunturi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (email) setUserEmail(email);

    if (!token) {
      setError("⚠ Trebuie să fii logat ca să vezi anunțurile tale.");
      setLoading(false);
      return;
    }

    const loadAds = async () => {
      try {
        const res = await fetch("http://localhost:5000/my-ads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Eroare la încărcarea anunțurilor");
        const data = await res.json();
        setAnunturi(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAds();
  }, []);

  const handleDelete = async (id) => {
    const confirmare = confirm("Ești sigur că vrei să ștergi acest anunț?");
    if (!confirmare) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/ads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare la ștergere");

      setMesaj("✅ Anunț șters cu succes!");
      setAnunturi(anunturi.filter((a) => a._id !== id));
    } catch (err) {
      setMesaj("❌ " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ Se încarcă anunțurile...</p>;
  if (error)
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Link
          href="/auth"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔑 Logare
        </Link>
      </div>
    );

  return (
    <div className="p-6">
      {/* Mesaj bun venit */}
      {userEmail && (
        <h2 className="text-xl font-semibold mb-6">
          👋 Bun venit, <span className="text-blue-600">{userEmail}</span>!
        </h2>
      )}

      <h1 className="text-3xl font-bold mb-6 text-center">📂 Anunțurile Mele</h1>
      {mesaj && <p className="mb-4 text-center">{mesaj}</p>}

      {anunturi.length === 0 ? (
        <p className="text-center text-gray-500">Nu ai niciun anunț creat încă.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {anunturi.map((anunt) => (
            <div
              key={anunt._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              {/* Imagine */}
              {anunt.imagini && anunt.imagini.length > 0 ? (
                <img
                  src={anunt.imagini[0]}
                  alt={anunt.titlu}
                  className="w-full h-52 object-cover"
                />
              ) : (
                <div className="w-full h-52 flex items-center justify-center bg-gray-200 text-gray-500">
                  📷 Fără imagine
                </div>
              )}

              {/* Conținut */}
              <div className="p-5">
                <h2 className="text-lg font-bold mb-2 text-gray-800">
                  {anunt.titlu}
                </h2>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {anunt.descriere}
                </p>
                <p className="text-green-700 font-bold text-xl mb-4">
                  💰 {anunt.pret} €
                </p>

                {/* Butoane */}
                <div className="flex gap-2">
                  <Link
                    href={`/anunturi/${anunt._id}/edit`}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-center hover:bg-blue-700 transition"
                  >
                    ✏️ Editează
                  </Link>
                  <button
                    onClick={() => handleDelete(anunt._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    🗑 Șterge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
