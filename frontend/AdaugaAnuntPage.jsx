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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesaj("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setMesaj("⚠ Trebuie să fii logat ca să adaugi un anunț.");
      setLoading(false);
      return;
    }

    try {
      // 🔹 Upload fiecare imagine pe Cloudinary
      const uploadedUrls = [];
      for (let i = 0; i < imagini.length; i++) {
        const formData = new FormData();
        formData.append("file", imagini[i]);
        formData.append("upload_preset", "anunturi_unsigned"); // presetul tău
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/daq0stys/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }

      // 🔹 Trimite datele + link-urile la backend
      const res = await fetch(
        "https://ebay-anunturi-backend-final-s2sf.onrender.com/api/anunturi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titlu,
            descriere,
            pret,
            imagini: uploadedUrls, // trimitem doar link-urile
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare la adăugarea anunțului");

      setMesaj("✅ Anunț adăugat cu succes!");
      router.push("/anunturile-mele");
    } catch (err) {
      setMesaj("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">➕ Adaugă Anunț Nou</h1>

      {mesaj && <p className="mb-4 text-center">{mesaj}</p>}
      {loading && <p className="mb-4 text-center">⏳ Se încarcă imaginile...</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block mb-1 font-semibold">Descriere</label>
          <textarea
            value={descriere}
            onChange={(e) => setDescriere(e.target.value)}
            className="w-full border rounded-lg p-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-se
