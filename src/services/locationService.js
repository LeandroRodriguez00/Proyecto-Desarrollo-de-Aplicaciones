import * as Location from "expo-location";

export const getUserLocation = async () => {
  try {
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus !== "granted") {
        throw new Error("Permiso de ubicación denegado.");
      }
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      maximumAge: 10000,
      timeout: 5000,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    throw new Error(`Error obteniendo la ubicación: ${error.message}`);
  }
};
