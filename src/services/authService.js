import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from "./firebaseConfig"; 

const isValidCredentials = (email, password) => {
  return email?.trim() && password?.trim() && password.length >= 6;
};

export const registerUser = async (email, password, fullName, phone, address, city, zipCode) => {
  if (!isValidCredentials(email, password)) {
    throw new Error("El correo debe ser válido y la contraseña debe tener al menos 6 caracteres.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      phone,
      address,
      city,
      zipCode,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Este correo ya está registrado. Intenta iniciar sesión.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("El formato del correo es inválido.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("La contraseña debe tener al menos 6 caracteres.");
    } else {
      throw new Error("Error en el registro. Inténtalo de nuevo más tarde.");
    }
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
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      throw new Error("Correo o contraseña incorrectos.");
    } else if (error.code === "auth/too-many-requests") {
      throw new Error("Demasiados intentos. Inténtalo más tarde.");
    } else {
      throw new Error("Error al iniciar sesión. Inténtalo nuevamente.");
    }
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw new Error("No se pudo cerrar sesión. Inténtalo de nuevo.");
  }
};
