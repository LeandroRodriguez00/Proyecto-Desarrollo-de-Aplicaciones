import { database, auth } from "./firebaseConfig";
import { ref, set, get, remove } from "firebase/database";

const getUserId = () => auth.currentUser?.uid || null;

export const saveCartToFirebase = async (cart) => {
  const userId = getUserId();
  if (!userId) throw new Error("Usuario no autenticado");

  try {
    await set(ref(database, `carts/${userId}`), cart);
    return true;
  } catch (error) {
    throw new Error("Error al guardar el carrito en Firebase: " + error.message);
  }
};

export const fetchCartFromFirebase = async () => {
  const userId = getUserId();
  if (!userId) throw new Error("Usuario no autenticado");

  try {
    const snapshot = await get(ref(database, `carts/${userId}`));
    return snapshot.exists() ? snapshot.val() : [];
  } catch (error) {
    throw new Error("Error al obtener el carrito desde Firebase: " + error.message);
  }
};

export const clearCartFromFirebase = async () => {
  const userId = getUserId();
  if (!userId) throw new Error("Usuario no autenticado");

  try {
    await remove(ref(database, `carts/${userId}`));
    return true;
  } catch (error) {
    throw new Error("Error al eliminar el carrito en Firebase: " + error.message);
  }
};
