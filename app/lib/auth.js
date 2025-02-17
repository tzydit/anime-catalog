import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "./firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);


export async function registerUser(email, password, username, router) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      username: username,
      email: email,
      createdAt: new Date().toISOString(),
    });

    if (router) router.push("/"); 
    return "Conta criada com sucesso!";
  } catch (error) {
    return `Erro: ${error.message}`;
  }
}


export async function loginUser(email, password, router) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    
    if (router) router.push("/"); 
    return "Login realizado com sucesso!";
  } catch (error) {
    return `Erro: ${error.message}`;
  }
}


export async function logoutUser(router) {
  try {
    await signOut(auth);
    
    if (router) router.push("/auth"); 
    return "Logout realizado!";
  } catch (error) {
    return `Erro ao sair: ${error.message}`;
  }
}
