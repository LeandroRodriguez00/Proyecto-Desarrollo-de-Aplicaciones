import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
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
      <Text style={styles.title}>Mis Compras</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : orders.length === 0 ? (
        <Text style={styles.emptyText}>No has realizado compras.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(order) => String(order.id)}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderText}>Pedido: {item.id}</Text>
              <Text style={styles.orderText}>Total: ${item.total?.toFixed(2) || "0.00"}</Text>
              <Text style={styles.orderText}>
                Fecha: {item.date ? new Date(item.date).toLocaleDateString() : "Fecha no disponible"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  emptyText: { fontSize: 18, textAlign: "center", color: "#666" },
  orderItem: { padding: 15, marginVertical: 10, backgroundColor: "#fff", borderRadius: 5 },
  orderText: { fontSize: 18 },
});
