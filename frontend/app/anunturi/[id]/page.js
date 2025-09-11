"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function DetaliiAnuntPage() {
  const { id } = useParams();
  const router = useRouter();
  const [anunt, setAnunt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) setUserEmail(email);

    const loadAd = async () => {
      try {
        const res = await fetch(`http://localhost:5000/ads/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        setAnunt(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAd();
  }, [id]);

  const handleDelete = async () => {
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

      alert("✅ Anunț șters cu succes!");
      router.push("/anunturi");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ Se încarcă anunțul...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!anunt) return <p className="text-center mt-10">❌ Anunțul nu a fost găsit.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* Imagine */}
      {anunt.imagini && anunt.imagini.length > 0 ? (
        <img
          src={anunt.imagini[0]}
          alt={anunt.titlu}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      ) : (
        <div className="w-full h-96 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg mb-6">
          📷 Fără imagine
        </div>
      )}

      {/* Titlu + Preț */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{anunt.titlu}</h1>
        <span className="text-2xl font-extrabold text-green-700">
          💰 {anunt.pret} €
        </span>
      </div>

      {/* Descriere */}
      <p className="text-gray-700 text-lg mb-6">{anunt.descriere}</p>

      {/* Proprietar */}
      <p className="text-gray-500 mb-6">
        👤 Publicat de: <span className="font-semibold">{anunt.user?.email}</span>
      </p>

      {/* Butoane Edit/Ștergere dacă userul e proprietar */}
      {userEmail === anunt.user?.email && (
        <div className="flex gap-4">
          <Link
            href={`/anunturi/${anunt._id}/edit`}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition"
          >
            ✏️ Editează
          </Link>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            🗑 Șterge
          </button>
        </div>
      )}
    </div>
  );
}
