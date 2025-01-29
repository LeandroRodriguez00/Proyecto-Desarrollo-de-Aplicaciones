import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

const isValidCredentials = (email, password) => {
  return email?.trim() && password?.trim() && password.length >= 6;
};

export const registerUser = async (email, password) => {
  if (!isValidCredentials(email, password)) {
    throw new Error("El correo y la contraseña son obligatorios y deben ser válidos.");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error?.message || "No se pudo completar el registro.");
  }
};

export const loginUser = async (email, password) => {
  if (!isValidCredentials(email, password)) {
    throw new Error("El correo y la contraseña son obligatorios y deben ser válidos.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error?.message || "No se pudo iniciar sesión.");
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.info("✅ Sesión cerrada correctamente.");
    return true;
  } catch (error) {
    throw new Error("No se pudo cerrar sesión. Inténtalo de nuevo.");
  }
};
