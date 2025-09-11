"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [parolaNoua, setParolaNoua] = useState("");
  const [parolaConfirm, setParolaConfirm] = useState("");
  const [mesaj, setMesaj] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token) {
      router.push("/auth");
    } else {
      if (email) setUserEmail(email);
    }
  }, [router]);

  const handleDeleteAccount = async () => {
    const confirmare = confirm("Ești sigur că vrei să ștergi contul?");
    if (!confirmare) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/delete-account", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare la ștergerea contului");

      alert("✅ Cont șters cu succes!");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      router.push("/auth");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMesaj("");

    if (parolaNoua !== parolaConfirm) {
      setMesaj("❌ Parolele nu coincid");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: parolaNoua }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare resetare parolă");

      setMesaj("✅ Parola schimbată cu succes!");
      setParolaNoua("");
      setParolaConfirm("");
    } catch (err) {
      setMesaj("❌ " + err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-6">👤 Profilul Meu</h1>

      <p className="text-lg mb-6">
        Email: <span className="font-semibold text-blue-600">{userEmail}</span>
      </p>

      {mesaj && <p className="mb-4">{mesaj}</p>}

      {/* Resetare parolă */}
      <form onSubmit={handlePasswordReset} className="space-y-4 mb-6">
        <input
          type="password"
          placeholder="Parolă nouă"
          value={parolaNoua}
          onChange={(e) => setParolaNoua(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirmă parolă"
          value={parolaConfirm}
          onChange={(e) => setParolaConfirm(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          🔑 Schimbă Parola
        </button>
      </form>

      {/* Ștergere cont */}
      <button
        onClick={handleDeleteAccount}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
      >
        🗑 Șterge Cont
      </button>
    </div>
  );
}
