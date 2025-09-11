"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [esteLogin, setEsteLogin] = useState(true);
  const [mesaj, setMesaj] = useState("");

  // 🔹 Redirecționare dacă userul e deja logat
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/anunturile-mele");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesaj("");

    try {
      const url = esteLogin
        ? "http://localhost:5000/api/login"
        : "http://localhost:5000/api/register";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: parola }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare");

      if (esteLogin) {
        // Salvăm token + email
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        router.push("/anunturile-mele");
      } else {
        setMesaj("✅ Cont creat cu succes! Poți să te loghezi acum.");
        setEsteLogin(true);
      }
    } catch (err) {
      setMesaj("❌ " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {esteLogin ? "Logare" : "Înregistrare"}
      </h1>

      {mesaj && <p className="mb-4 text-center">{mesaj}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Parola"
          value={parola}
          onChange={(e) => setParola(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {esteLogin ? "Logare" : "Înregistrare"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        {esteLogin ? "Nu ai cont?" : "Ai deja cont?"}{" "}
        <button
          onClick={() => setEsteLogin(!esteLogin)}
          className="text-blue-600 underline"
        >
          {esteLogin ? "Înregistrează-te" : "Loghează-te"}
        </button>
      </p>
    </div>
  );
}
