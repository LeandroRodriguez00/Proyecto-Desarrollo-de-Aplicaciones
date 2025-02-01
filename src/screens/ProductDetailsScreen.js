import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cartSlice";
import { fetchCartFromStorage, saveCartToStorage } from "../services/storage";

export default function ProductDetailsScreen({ route, navigation }) {
  const { productId, productName, productPrice, productDescription, productImage } = route.params;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); 

  const handleAddToCart = async () => {
    if (loading) return; 
    setLoading(true);

    const product = { id: productId, name: productName, price: productPrice };

    try {
      const existingCart = (await fetchCartFromStorage()) || [];
      const updatedCart = existingCart.some((item) => item.id === product.id)
        ? existingCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...existingCart, { ...product, quantity: 1 }];

      await saveCartToStorage(updatedCart);
      dispatch(addItem({ ...product, quantity: 1 }));

      Alert.alert("Éxito", "Producto agregado al carrito.");
    } catch (error) {
      console.warn("Error al agregar producto al carrito:", error);
      Alert.alert("Error", "No se pudo agregar el producto al carrito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: productImage }} style={styles.productImage} />
      
      <View style={styles.productCard}>
        <Text style={styles.title}>{productName}</Text>
        <Text style={styles.price}>💰 Precio: ${productPrice?.toFixed(2) || "0.00"}</Text>
        
        <ScrollView style={styles.descriptionContainer}>
          <Text style={styles.description}>{productDescription}</Text>
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleAddToCart} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>🛒 Agregar al carrito</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
        <Text style={styles.buttonText}>🛍️ Ir al carrito</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#222831",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: "#2E3A46",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#EEEEEE",
    textAlign: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: "#4A90E2",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionContainer: {
    maxHeight: 150, 
  },
  description: {
    fontSize: 16,
    color: "#C4C4C4",
    textAlign: "center",
    paddingBottom: 10,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    marginBottom: 10,
  },
  cartButton: {
    backgroundColor: "#6C757D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

