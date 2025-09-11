"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditAnuntPage() {
  const { id } = useParams();
  const router = useRouter();

  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [pret, setPret] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAd = async () => {
      try {
        const res = await fetch(`http://localhost:5000/ads/${id}`);
        if (!res.ok) throw new Error("Eroare la încărcarea anunțului");
        const data = await res.json();
        setTitlu(data.titlu);
        setDescriere(data.descriere);
        setPret(data.pret);
      } catch (err) {
        setMesaj("❌ " + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAd();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesaj("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMesaj("⚠ Trebuie să fii logat pentru a edita anunțul.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/ads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titlu, descriere, pret }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare la editare");

      setMesaj("✅ Anunț modificat cu succes!");
      router.push(`/anunturi/${id}`);
    } catch (err) {
      setMesaj("❌ " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ Se încarcă...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">✏️ Editează Anunț</h1>

      {mesaj && <p className="mb-4 text-center">{mesaj}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titlu */}
        <div>
          <label className="block mb-1 font-semibold">Titlu</label>
          <input
            type="text"
            value={titlu}
            onChange={(e) => setTitlu(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Descriere */}
        <div>
          <label className="block mb-1 font-semibold">Descriere</label>
          <textarea
            value={descriere}
            onChange={(e) => setDescriere(e.target.value)}
            className="w-full border rounded-lg p-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Preț */}
        <div>
          <label className="block mb-1 font-semibold">Preț (€)</label>
          <input
            type="number"
            value={pret}
            onChange={(e) => setPret(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Buton submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          💾 Salvează Modificările
        </button>
      </form>
    </div>
  );
}
