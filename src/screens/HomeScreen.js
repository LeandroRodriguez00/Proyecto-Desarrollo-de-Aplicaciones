import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  Image,
} from "react-native";
import { fetchProducts } from "../services/databaseService";
import { FAB } from "react-native-paper";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchProducts();
      setProducts(
        Array.isArray(data)
          ? data.filter((item) => item.id && item.name && typeof item.price === "number")
          : []
      );

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.warn("Error al cargar productos:", error);
      Alert.alert("Error", "No se pudieron cargar los productos. Intenta de nuevo.");
    } finally {
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Productos Disponibles</Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : products.length === 0 ? (
        <Text style={styles.noProductsText}>No hay productos disponibles.</Text>
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productContainer}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("ProductDetails", {
                    productId: item.id,
                    productName: item.name,
                    productPrice: item.price,
                    productDescription: item.description, 
                    productImage: item.image, 
                  })
                }
              >
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productText}>{item.name}</Text>
                  <Text style={styles.productPrice}>💰 ${item.price.toFixed(2)}</Text>
                  <Text style={styles.productDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}

      {}
      <FAB
        style={styles.fab}
        icon="cart"
        label="Ir al carrito"
        onPress={() => navigation.navigate("Cart")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831", 
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#EEEEEE", 
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: "#C4C4C4", 
  },
  noProductsText: {
    fontSize: 18,
    textAlign: "center",
    color: "#C4C4C4",
    marginTop: 20,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E3A46",
    padding: 10,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#EEEEEE",
  },
  productPrice: {
    fontSize: 16,
    color: "#4A90E2",
    marginTop: 5,
  },
  productDescription: {
    fontSize: 14,
    color: "#C4C4C4",
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 10,
    backgroundColor: "#4A90E2", 
  },
});
