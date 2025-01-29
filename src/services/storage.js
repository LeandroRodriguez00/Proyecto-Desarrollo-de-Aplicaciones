import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchCartFromStorage = async () => {
  try {
    const storedCart = await AsyncStorage.getItem('cart');
    if (!storedCart) return [];

    const parsedCart = JSON.parse(storedCart);
    if (!Array.isArray(parsedCart)) {
      await clearCartFromStorage();
      return [];
    }

    return parsedCart;
  } catch (error) {
    throw new Error("Error al obtener el carrito desde AsyncStorage: " + error.message);
  }
};

export const saveCartToStorage = async (cart) => {
  if (!Array.isArray(cart)) throw new Error("El carrito debe ser un array válido.");

  try {
    const cartClone = JSON.parse(JSON.stringify(cart)); // 🔄 Reemplazo de structuredClone
    await AsyncStorage.setItem('cart', JSON.stringify(cartClone));
  } catch (error) {
    throw new Error("Error al guardar el carrito en AsyncStorage: " + error.message);
  }
};


export const clearCartFromStorage = async () => {
  try {
    await AsyncStorage.removeItem('cart');
  } catch (error) {
    throw new Error("Error al limpiar el carrito en AsyncStorage: " + error.message);
  }
};

export const addToCartInStorage = async (item) => {
  try {
    const currentCart = await fetchCartFromStorage();
    const existingItemIndex = currentCart.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({ ...item, quantity: 1 });
    }

    await saveCartToStorage(currentCart);
  } catch (error) {
    throw new Error("Error al agregar producto al carrito: " + error.message);
  }
};

export const removeFromCartInStorage = async (itemId) => {
  try {
    const currentCart = await fetchCartFromStorage();
    const updatedCart = currentCart.filter((item) => item.id !== itemId);
    await saveCartToStorage(updatedCart);
  } catch (error) {
    throw new Error("Error al eliminar producto del carrito: " + error.message);
  }
};

export const decrementItemInCart = async (itemId) => {
  try {
    const currentCart = await fetchCartFromStorage();
    const updatedCart = currentCart
      .map((item) => (item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0);

    await saveCartToStorage(updatedCart);
  } catch (error) {
    throw new Error("Error al reducir la cantidad del producto: " + error.message);
  }
};

export const replaceCartInStorage = async (newCart) => {
  if (!Array.isArray(newCart)) throw new Error("El carrito debe ser un array válido.");

  try {
    await saveCartToStorage(newCart);
  } catch (error) {
    throw new Error("Error al reemplazar el carrito en AsyncStorage: " + error.message);
  }
};
