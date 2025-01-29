import React, { useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { replaceCart, removeItem, clearCart } from "../redux/cartSlice";
import { fetchCartFromStorage, saveCartToStorage } from "../services/storage";
import { ref, get, set } from "firebase/database";
import { database } from "../services/firebaseConfig";
import { saveOrderToFirebase } from "../services/orderService";

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const loadCartItems = useCallback(async () => {
    try {
      const storedCart = await fetchCartFromStorage();
      if (storedCart.length > 0) {
        dispatch(replaceCart(storedCart));
        return;
      }

      const dbRef = ref(database, "cart/");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const firebaseCart = Object.values(snapshot.val());
        dispatch(replaceCart(firebaseCart));
        await saveCartToStorage(firebaseCart);
      }
    } catch (error) {
      console.warn("Error al cargar el carrito:", error);
      Alert.alert("Error", "No se pudo cargar el carrito.");
    }
  }, [dispatch]);

  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  const validCartItems = cartItems.filter(
    (item) => item?.id && item?.name && typeof item?.price === "number"
  );

  const total = validCartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const saveCartToFirebase = async () => {
    if (validCartItems.length === 0) {
      Alert.alert("Error", "No hay productos válidos en el carrito.");
      return;
    }

    try {
      await set(ref(database, "cart/"), validCartItems);
      Alert.alert("✅ Carrito guardado", "El carrito se guardó en la nube.");
    } catch (error) {
      console.warn("Error al guardar el carrito en Firebase:", error);
      Alert.alert("Error", "No se pudo guardar el carrito.");
    }
  };

  const handlePurchase = async () => {
    if (validCartItems.length === 0) {
      Alert.alert("Carrito vacío", "No hay productos válidos en el carrito.");
      return;
    }

    try {
      const order = await saveOrderToFirebase(validCartItems, total);
      if (order) {
        Alert.alert("✅ Compra realizada", "Tu pedido ha sido registrado.");
        dispatch(clearCart());
        await saveCartToStorage([]);
      } else {
        Alert.alert("❌ Error", "No se pudo procesar la compra.");
      }
    } catch (error) {
      console.warn("Error al procesar la compra:", error);
      Alert.alert("Error", "Ocurrió un problema al finalizar la compra.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito de Compras</Text>
      <Button title="GUARDAR CARRITO EN FIREBASE" color="#007bff" onPress={saveCartToFirebase} />

      {validCartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay productos válidos en el carrito.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={validCartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemText}>${item.price.toFixed(2)}</Text>
                <Text style={styles.itemText}>Cantidad: {item.quantity || 1}</Text>
                <Button title="ELIMINAR" color="red" onPress={() => dispatch(removeItem(item.id))} />
              </View>
            )}
          />
          <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
          <Button title="COMPRAR" color="green" onPress={handlePurchase} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, textAlign: "center", color: "#666" },
  item: { padding: 15, marginVertical: 10, backgroundColor: "#fff", borderRadius: 5 },
  itemText: { fontSize: 18, color: "#333" },
  totalText: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 10 },
});

