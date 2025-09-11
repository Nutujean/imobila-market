"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdaugaAnuntPage() {
  const router = useRouter();
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [pret, setPret] = useState("");
  const [imagini, setImagini] = useState([]);
  const [mesaj, setMesaj] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesaj("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMesaj("⚠ Trebuie să fii logat ca să adaugi un anunț.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titlu", titlu);
      formData.append("descriere", descriere);
      formData.append("pret", pret);

      for (let i = 0; i < imagini.length; i++) {
        formData.append("imagini", imagini[i]);
      }

      const res = await fetch("http://localhost:5000/ads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare la adăugarea anunțului");

      setMesaj("✅ Anunț adăugat cu succes!");
      router.push("/anunturile-mele");
    } catch (err) {
      setMesaj("❌ " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">➕ Adaugă Anunț Nou</h1>

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

        {/* Upload imagini */}
        <div>
          <label className="block mb-1 font-semibold">Imagini (max 10)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImagini(Array.from(e.target.files))}
            className="w-full border rounded-lg p-2 bg-gray-50"
          />
        </div>

        {/* Buton submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          ✅ Publică Anunț
        </button>
      </form>
    </div>
  );
}
