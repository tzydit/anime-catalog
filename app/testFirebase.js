"use client";
import { useEffect, useState } from "react";
import { db } from "./lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function TestFirebase() {
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    const fetchAnimes = async () => {
        const querySnapshot = await getDocs(collection(db, "anime"));
        const animeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnimes(animeList);
    };

    fetchAnimes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Testando Firebase</h1>
      {animes.length > 0 ? (
        animes.map((anime) => (
          <div key={anime.id} className="p-2 border-b border-gray-400">
            <h2 className="text-lg">{anime.name}</h2>
            <p>{anime.description}</p>
          </div>
        ))
      ) : (
        <p>Nenhum anime encontrado.</p>
      )}
    </div>
  );
}
