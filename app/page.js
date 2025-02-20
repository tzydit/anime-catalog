"use client";

import { useEffect, useState } from "react";
import { fetchAnimes } from "./lib/fetchAnimes";
import Header from "./components/Header";
import Link from "next/link";

export default function Home() {
  const [weeklyAnimes, setWeeklyAnimes] = useState([]);
  const [yearlyAnimes, setYearlyAnimes] = useState([]);
  const [allTimeAnimes, setAllTimeAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadAnimes() {
      setLoading(true);
      setWeeklyAnimes(await fetchAnimes("week"));
      setYearlyAnimes(await fetchAnimes("year"));
      setAllTimeAnimes(await fetchAnimes("all"));
      setLoading(false);
    }
    loadAnimes();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-6 mt-8">Catálogo de Animes</h1>

        {loading ? (
          <p className="text-center text-gray-400">Carregando animes...</p>
        ) : (
          <>
            <Section title="🔥 Mais Bem Avaliados da Semana" animes={weeklyAnimes} />
            <Section title="🏆 Melhores do Ano" animes={yearlyAnimes} />
            <Section title="⭐ Todos os Tempos" animes={allTimeAnimes} />
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, animes }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-200 border-b border-gray-700 pb-2">
        {title}
      </h2>

      {animes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {animes.map((anime) => (
            <div key={anime.mal_id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              <Link href={`/anime/${anime.mal_id}`} passHref>
                <div className="relative w-full h-64 cursor-pointer">
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
                  />
                </div>
              </Link>
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold text-white truncate">{anime.title}</h2>
                <p className="text-sm text-gray-400 mt-1">⭐ {anime.score}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">Carregando animes...</p>
      )}
    </div>
  );
}
