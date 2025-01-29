import { createSlice } from "@reduxjs/toolkit";
import { saveCartToFirebase, fetchCartFromFirebase, clearCartFromFirebase } from "../services/cartService";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      try {
        saveCartToFirebase(state.items);
      } catch (error) {
        console.warn("Error al guardar el carrito en Firebase:", error);
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      try {
        saveCartToFirebase(state.items);
      } catch (error) {
        console.warn("Error al actualizar el carrito en Firebase:", error);
      }
    },

    clearCart: (state) => {
      state.items = [];

      try {
        clearCartFromFirebase();
      } catch (error) {
        console.warn("Error al borrar el carrito en Firebase:", error);
      }
    },

    replaceCart: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { addItem, removeItem, clearCart, replaceCart } = cartSlice.actions;
export const loadCartFromFirebase = () => async (dispatch) => {
  try {
    const cart = await fetchCartFromFirebase();
    dispatch(replaceCart(cart ?? []));
  } catch (error) {
    console.warn("Error al cargar el carrito desde Firebase:", error);
  }
};

export default cartSlice.reducer;
