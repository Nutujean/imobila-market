"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    setIsLogged(!!token);
    if (email) setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLogged(false);
    setUserEmail("");
    router.push("/auth");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/anunturi"
          className="text-2xl font-extrabold tracking-wide hover:text-yellow-300 transition"
        >
          🏠 ImobiliaMarket
        </Link>

        {/* Linkuri */}
        <div className="hidden md:flex gap-6">
          <Link href="/anunturi" className="hover:text-yellow-300 transition">
            📋 Toate Anunțurile
          </Link>
          <Link href="/adauga-anunt" className="hover:text-yellow-300 transition">
            ➕ Adaugă Anunț
          </Link>
          <Link
            href="/anunturile-mele"
            className="hover:text-yellow-300 transition"
          >
            📂 Anunțurile Mele
          </Link>
          {isLogged && (
            <Link href="/profil" className="hover:text-yellow-300 transition">
              👤 Profil
            </Link>
          )}
        </div>

        {/* User info */}
        <div className="flex items-center gap-4">
          {isLogged && userEmail && (
            <span className="text-sm text-yellow-200 hidden sm:inline">
              {userEmail}
            </span>
          )}

          {isLogged ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              🚪 Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              🔑 Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
