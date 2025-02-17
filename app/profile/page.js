"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { db, storage } from "../lib/firebaseConfig";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function ProfilePage() {
  const auth = getAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("/default-avatar.jpg"); 
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setName(user.displayName || "");
        setPhoto(user.photoURL || "/default-avatar.jpg");

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name || user.displayName);
          setPhoto(userDoc.data().photoURL || user.photoURL);
        }

        const q = query(collection(db, "reviews"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setReviews(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        router.push("/auth");
      }
      setLoading(false);
    });
  }, [auth, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  const handleSave = async () => {
    if (user) {
      await updateProfile(user, { displayName: name, photoURL: photo });
      await updateDoc(doc(db, "users", user.uid), { name, photoURL: photo });
      setEditing(false);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, e.target.files[0]);
      const downloadURL = await getDownloadURL(storageRef);
      setPhoto(downloadURL);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-4xl">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center">
          <ArrowLeftIcon className="h-6 w-6 mr-2" />
          Voltar
        </button>
      </div>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center mt-4">
        <h2 className="text-2xl font-bold mb-4">Perfil</h2>

        <div className="relative w-32 h-32 mx-auto">
  {photo ? (
    <img src={photo} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-gray-700" />
  ) : (
    <UserCircleIcon className="w-full h-full text-gray-500" />
  )}
  {editing && (
    <input type="file" onChange={handleFileChange} className="absolute bottom-0 left-0 w-full text-xs text-center bg-gray-700 text-white opacity-80" />
  )}
</div>


        {editing ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-4 p-2 rounded bg-gray-700 text-white text-center"
            />
            <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full">
              Salvar Alterações
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mt-4">{name}</h3>
            <p className="text-gray-400">{user.email}</p>
            <button onClick={() => setEditing(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full">
              Editar Perfil
            </button>
          </>
        )}

        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4 w-full">
          Sair da Conta
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-4xl mt-6">
        <h2 className="text-2xl font-bold mb-4">Minhas Avaliações</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-700 pb-4 mb-4">
              <h3 className="text-lg font-semibold">{review.animeTitle}</h3>
              <p className="text-yellow-400">Nota: {review.rating} / 10</p>
              <p className="text-gray-400 mt-2">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Nenhuma avaliação encontrada.</p>
        )}
      </div>
    </div>
  );
}
