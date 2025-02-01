import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { getUserLocation } from "../services/locationService";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const loc = await getUserLocation();
        setLocation(loc);
      } catch (err) {
        console.warn("Error al obtener ubicación:", err);
        setError("No se pudo obtener la ubicación. Verifica los permisos.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);


  const mapUrl = location
    ? `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=14`
    : "https://www.openstreetmap.org";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Ubicación Actual</Text>

      {loading && <ActivityIndicator size="large" color="#4A90E2" />}
      {error && <Text style={styles.errorText}>⚠ {error}</Text>}

      {location ? (
        <WebView
          originWhitelist={["*"]}
          source={{ uri: mapUrl }}
          style={styles.map}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      ) : (
        !loading && <Text style={styles.errorText}>⚠ No se pudo obtener la ubicación</Text>
      )}

      <TouchableOpacity style={styles.updateButton} onPress={() => setLoading(true)}>
        <Text style={styles.buttonText}>🔄 Actualizar Ubicación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#222831" },
  title: { fontSize: 24, fontWeight: "bold", color: "#EEEEEE", marginBottom: 15 },
  errorText: { fontSize: 16, color: "#FF3D71", textAlign: "center", marginVertical: 10 },
  map: { width: "100%", height: 400, marginVertical: 20, borderRadius: 10 },
  updateButton: { backgroundColor: "#4A90E2", padding: 15, borderRadius: 10, alignItems: "center", width: "90%", marginTop: 10 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
