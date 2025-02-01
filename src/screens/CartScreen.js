import React, { useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, Alert, 
  TouchableOpacity, ActivityIndicator 
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, clearCart } from "../redux/cartSlice";
import { saveCartToStorage } from "../services/storage";
import { saveOrderToFirebase } from "../services/orderService";

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(false);

  const validCartItems = cartItems.filter(
    (item) => item?.id && item?.name && typeof item?.price === "number"
  );

  const total = validCartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handlePurchase = async () => {
    if (validCartItems.length === 0) {
      Alert.alert("Carrito vacío", "No hay productos válidos en el carrito.");
      return;
    }

    setLoading(true);

    try {
      const order = await saveOrderToFirebase(validCartItems, total);
      if (order) {
        Alert.alert("Compra realizada", "Tu pedido ha sido registrado.");
        dispatch(clearCart());
        await saveCartToStorage([]);

        navigation.navigate("Orders"); 
      } else {
        Alert.alert("Error", "No se pudo procesar la compra.");
      }
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      Alert.alert("Error", "Ocurrió un problema al finalizar la compra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : validCartItems.length === 0 ? (
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

          <TouchableOpacity style={styles.buyButton} onPress={handlePurchase} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}> Comprar</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    padding: 20,
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
});
