"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/components/Header";
import { db } from "@/app/lib/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function AnimePage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);

  const auth = getAuth(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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

  useEffect(() => {
    async function fetchReviews() {
      if (!id) return;
      try {
        const reviewsQuery = query(collection(db, "reviews"), where("animeId", "==", id));
        const querySnapshot = await getDocs(reviewsQuery);
        setReviews(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      }
    }
    fetchReviews();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }

    if (!rating || !comment.trim()) {
      alert("Por favor, selecione uma nota e escreva um comentário.");
      return;
    }

    const newReview = {
      animeId: id,
      userId: user.uid,
      username: user.displayName || "Usuário Anônimo",
      rating,
      comment,
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "reviews"), newReview);
      setReviews([...reviews, { id: docRef.id, ...newReview }]);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
    }
  };

  const handleDelete = async (reviewId, userId) => {
    if (user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
    }
  };

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

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-10 max-w-6xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="w-full md:w-1/3">
          <img
            src={anime.images.jpg.large_image_url}
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
              <h2 className="text-xl font-bold">Trailer</h2>
              <iframe
                src={anime.trailer.embed_url}
                title="Trailer"
                allowFullScreen
                className="w-full h-64 mt-2 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 text-white p-6 mt-8 max-w-6xl mx-auto rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Deixe sua avaliação</h2>

        <div className="flex space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-3xl ${star <= rating ? "text-yellow-400" : "text-gray-600"}`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-gray-900 p-2 rounded-lg text-white"
          placeholder="Escreva seu comentário..."
        />

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Enviar Avaliação
        </button>

        <h3 className="text-xl font-bold mt-6">Comentários:</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-400">Nenhuma avaliação ainda.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-start">
                <div>
                  <span className="text-yellow-400 text-lg">{"★".repeat(review.rating)}</span>
                  <p className="mt-2 font-semibold">{review.username}</p>
                  <p className="text-gray-400">{review.comment}</p>
                </div>
                {user?.uid === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id, review.userId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Excluir
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
