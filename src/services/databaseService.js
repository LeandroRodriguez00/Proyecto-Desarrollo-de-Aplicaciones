import { ref, set, push, get } from "firebase/database";
import { database } from "./firebaseConfig";

export const saveProduct = async (product) => {
  try {
    const productsRef = ref(database, "products");
    const newProductRef = push(productsRef);
    await set(newProductRef, { id: newProductRef.key, ...product });
    return true;
  } catch (error) {
    throw new Error("Error al guardar el producto en Firebase: " + error.message);
  }
};

export const fetchProducts = async () => {
  try {
    const productsRef = ref(database, "products");
    const snapshot = await get(productsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const rawData = snapshot.val();
    return Object.keys(rawData).map((key) => ({
      id: key,
      ...rawData[key],
    }));
  } catch (error) {
    throw new Error("Error al obtener productos desde Firebase: " + error.message);
  }
};
