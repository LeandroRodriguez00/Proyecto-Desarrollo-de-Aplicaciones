import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";
import { fetchCartFromStorage, saveCartToStorage } from "../services/storage";

export default function ProductDetailsScreen({ route, navigation }) {
  const { productId, productName, productPrice } = route.params;
  const dispatch = useDispatch();

  const isValidProduct = (id, name, price) =>
    id && name && typeof price === "number" && price >= 0;

  const handleAddToCart = async () => {
    if (!isValidProduct(productId, productName, productPrice)) {
      Alert.alert("Error", "Producto inválido.");
      return;
    }

    const product = { id: productId, name: productName, price: productPrice };

    try {
      const existingCart = (await fetchCartFromStorage()) || [];
      const productIndex = existingCart.findIndex((item) => item.id === product.id);

      let updatedCart;
      let quantity = 1;

      if (productIndex !== -1) {
        updatedCart = existingCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        quantity = existingCart[productIndex].quantity + 1;
      } else {
        updatedCart = [...existingCart, { ...product, quantity }];
      }

      await saveCartToStorage(updatedCart);
      dispatch(addItem({ ...product, quantity }));

      Alert.alert("Éxito", "Producto agregado al carrito.");
    } catch (error) {
      console.warn("Error al agregar producto al carrito:", error);
      Alert.alert("Error", "No se pudo agregar el producto al carrito.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productName}</Text>
      <Text style={styles.price}>Precio: ${productPrice?.toFixed(2) || "0.00"}</Text>
      <Button title="Agregar al carrito" onPress={handleAddToCart} />
      <Button title="Ir al carrito" onPress={() => navigation.navigate("Cart")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  price: {
    fontSize: 20,
    color: "#666",
    marginBottom: 20,
  },
});
