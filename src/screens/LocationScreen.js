import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
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
      <Text style={styles.title}>Ubicación Actual</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {location ? (
        <MapView 
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} title="Tu ubicación" />
        </MapView>
      ) : (
        <Text>No se pudo obtener la ubicación</Text>
      )}

      <Button title="Actualizar Ubicación" onPress={fetchLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
});
