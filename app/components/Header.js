"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${search.trim()}`);
    }
  };

  return (
    <header className="bg-gray-900 text-white shadow-md py-8 w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <h1 className="text-3xl font-bold">
          <Link href="/"><span className="text-blue-400">Anime</span>Catalog</Link>
        </h1>

        <form onSubmit={handleSearch} className="flex-grow max-w-md mx-auto">
          <input
            type="text"
            placeholder="Pesquisar animes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
          />
        </form>

        <div className="relative flex items-center">
          {user ? (
            <button onClick={() => router.push("/profile")} className="flex items-center">
              <UserCircleIcon className="h-9 w-9 text-gray-300 hover:text-white transition duration-200 ml-6" />
            </button>
          ) : (
            <button onClick={() => router.push("/auth")} className="ml-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
