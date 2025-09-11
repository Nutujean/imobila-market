"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/anunturile-mele");
    } else {
      router.push("/anunturi");
    }
  }, [router]);

  return <p className="text-center mt-10">🔄 Redirecționare...</p>;
}
