"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";

export default function AnimePage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnime() {
      setLoading(true);
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        const data = await response.json();
        setAnime(data.data);
      } catch (error) {
        console.error("Erro ao buscar o anime:", error);
      }
      setLoading(false);
    }
    if (id) fetchAnime();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Carregando...</div>;
  }

  if (!anime) {
    return <div className="flex justify-center items-center h-screen text-red-500">Anime não encontrado</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />

      <h1 className="text-4xl font-bold text-center mt-6">{anime.title}</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-10 max-w-7xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        
        <div className="w-full md:w-1/3">
          <img
            src={anime.images.webp.large_image_url}
            alt={anime.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="w-full md:w-2/3">
          <p className="text-gray-400 text-lg">{anime.synopsis}</p>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-yellow-400 text-2xl font-bold">⭐ {anime.score}</span>
            <span className="text-gray-400 text-sm">(Baseado em {anime.scored_by} avaliações)</span>
          </div>
          {anime.trailer?.embed_url && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Trailer</h2>
              <div className="w-full aspect-video">
                <iframe
                  src={anime.trailer.embed_url}
                  title="Trailer"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
