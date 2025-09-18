import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mesaj, setMesaj] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMesaj("");

    try {
      const res = await fetch("https://imobila-market.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMesaj("Autentificare reușită ✅");
      } else {
        setMesaj(data.error || "Eroare la autentificare");
      }
    } catch (err) {
      setMesaj("Eroare: " + err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {mesaj && <p><b>{mesaj}</b></p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Parolă" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{ padding: "10px", background: "blue", color: "white", border: "none" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
