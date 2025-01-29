import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { fetchOrdersFromFirebase } from "../services/orderService";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedOrders = await fetchOrdersFromFirebase();
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
    } catch (error) {
      Alert.alert("❌ Error", "No se pudieron cargar los pedidos.");
      console.warn("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Mis Compras</Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Cargando pedidos...</Text>
        </View>
      ) : orders.length === 0 ? (
        <Text style={styles.emptyText}>❌ No has realizado compras.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(order) => String(order.id)}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderTitle}>🛒 Pedido #{item.id}</Text>
              <Text style={styles.orderText}>💰 Total: ${item.total?.toFixed(2) || "0.00"}</Text>
              <Text style={styles.orderText}>
                📅 Fecha: {item.date ? new Date(item.date).toLocaleDateString() : "Fecha no disponible"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#222831",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EEEEEE", 
    textAlign: "center",
    marginBottom: 20,
  },
  loaderContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#C4C4C4",
    marginTop: 10,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    color: "#FF3D71", 
  },
  orderItem: {
    backgroundColor: "#2E3A46",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2", 
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  orderText: {
    fontSize: 16,
    color: "#EEEEEE", 
    marginTop: 5,
  },
});
