import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getUserLocation } from "../services/locationService";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    const loc = await getUserLocation();
    setLocation(loc);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Ubicación Actual</Text>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
        </View>
      )}

      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          customMapStyle={mapStyle} 
        >
          <Marker coordinate={location} title="Tu ubicación" />
        </MapView>
      ) : (
        <Text style={styles.errorText}>⚠ No se pudo obtener la ubicación</Text>
      )}

      <TouchableOpacity style={styles.updateButton} onPress={fetchLocation}>
        <Text style={styles.buttonText}>🔄 Actualizar Ubicación</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#222831", 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EEEEEE", 
    marginBottom: 15,
  },
  loaderContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 15,
  },
  loadingText: {
    fontSize: 16,
    color: "#C4C4C4",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3D71", 
    textAlign: "center",
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: 350,
    marginVertical: 20,
    borderRadius: 10, 
  },
  updateButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});


const mapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1D2C4D" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#8EC3B9" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1A3646" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#4B6878" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263C" }],
  },
];

