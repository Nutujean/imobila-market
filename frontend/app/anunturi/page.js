"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnunturiPage() {
  const [anunturi, setAnunturi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const loadAds = async () => {
      try {
        const res = await fetch("http://localhost:5000/ads");
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

    const email = localStorage.getItem("email");
    if (email) setUserEmail(email);
  }, []);

  if (loading) return <p className="text-center mt-10">⏳ Se încarcă anunțurile...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-6">
      {/* Mesaj bun venit */}
      {userEmail && (
        <h2 className="text-xl font-semibold mb-6">
          👋 Bun venit, <span className="text-blue-600">{userEmail}</span>!
        </h2>
      )}

      <h1 className="text-3xl font-bold mb-6 text-center">📋 Toate Anunțurile</h1>

      {anunturi.length === 0 ? (
        <p className="text-gray-500 text-center">Nu există anunțuri momentan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {anunturi.map((anunt) => (
            <Link
              key={anunt._id}
              href={`/anunturi/${anunt._id}`}
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
                <p className="text-green-700 font-bold text-xl">
                  💰 {anunt.pret} €
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
