"use client";

import { useState } from "react";
import { registerUser, loginUser } from "../lib/auth"; 
import { useRouter } from "next/navigation"; 

export default function AuthPage() {
  const router = useRouter(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      const result = await registerUser(email, password, username, router); 
      setMessage(result);
    } else {
      const result = await loginUser(email, password, router); 
      setMessage(result);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isRegistering ? "Criar Conta" : "Entrar"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {isRegistering && (
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 bg-gray-700 rounded-lg border border-gray-600"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 bg-gray-700 rounded-lg border border-gray-600"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 bg-gray-700 rounded-lg border border-gray-600"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isRegistering ? "Registrar" : "Entrar"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}

        <p className="text-sm text-center mt-4">
          {isRegistering ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Entrar" : "Criar Conta"}
          </span>
        </p>
      </div>
    </div>
  );
}
