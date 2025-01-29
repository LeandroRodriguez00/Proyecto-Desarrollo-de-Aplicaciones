import { ref, push, set, get } from "firebase/database";
import { auth, database } from "./firebaseConfig";

const getUserId = () => auth.currentUser?.uid || null;

export const saveOrderToFirebase = async (cartItems, totalPrice) => {
  const userId = getUserId();
  if (!userId) throw new Error("Usuario no autenticado");

  try {
    const ordersRef = ref(database, `orders/${userId}`);
    const newOrderRef = push(ordersRef);

    const orderData = {
      id: newOrderRef.key,
      items: cartItems,
      total: totalPrice,
      date: new Date().toISOString(),
    };

    await set(newOrderRef, orderData);
    return orderData; 
  } catch (error) {
    throw new Error("Error al guardar la orden en Firebase: " + error.message);
  }
};

export const fetchOrdersFromFirebase = async () => {
  const userId = getUserId();
  if (!userId) throw new Error("Usuario no autenticado");

  try {
    const ordersRef = ref(database, `orders/${userId}`);
    const snapshot = await get(ordersRef);

    return snapshot.exists()
      ? Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }))
      : [];
  } catch (error) {
    throw new Error("Error al obtener las órdenes desde Firebase: " + error.message);
  }
};
