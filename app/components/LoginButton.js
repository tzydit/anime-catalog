"use client";

import { useState, useEffect } from "react";
import { loginWithGoogle, logout } from "../lib/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../lib/firebaseConfig"; 

export default function LoginButton() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    })

    return (
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />
              <p className="text-white">{user.displayName}</p>
              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 transition"
            >
              Entrar com Google
            </button>
          )}
        </div>
      );
    
}