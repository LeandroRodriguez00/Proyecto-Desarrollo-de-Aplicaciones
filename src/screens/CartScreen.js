import React, { useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { replaceCart, removeItem, clearCart } from "../redux/cartSlice";
import { fetchCartFromStorage, saveCartToStorage } from "../services/storage";
import { ref, get, set } from "firebase/database";
import { database } from "../services/firebaseConfig";
import { saveOrderToFirebase } from "../services/orderService";
import { FAB } from "react-native-paper";

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
      <Text style={styles.title}>🛒 Carrito de Compras</Text>

      <TouchableOpacity style={styles.saveButton} onPress={saveCartToFirebase}>
        <Text style={styles.buttonText}>💾 Guardar Carrito</Text>
      </TouchableOpacity>

      {validCartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay productos en el carrito.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={validCartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.itemQuantity}>Cantidad: {item.quantity || 1}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => dispatch(removeItem(item.id))}
                >
                  <Text style={styles.buttonText}>❌ Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>

          <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
            <Text style={styles.buttonText}>🛍️ Comprar</Text>
          </TouchableOpacity>
        </>
      )}

      <FAB style={styles.fab} icon="cart" label="Ir a Tienda" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#EEEEEE", 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#C4C4C4", 
  },
  item: {
    backgroundColor: "#2E3A46", 
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2", 
  },
  itemText: {
    fontSize: 18,
    color: "#EEEEEE",
  },
  itemPrice: {
    fontSize: 16,
    color: "#4A90E2", 
    marginTop: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#C4C4C4",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buyButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A90E2",
    textAlign: "center",
    marginVertical: 15,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 10,
    backgroundColor: "#4A90E2",
  },
});
