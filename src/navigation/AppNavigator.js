import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import CartScreen from "../screens/CartScreen";
import LocationScreen from "../screens/LocationScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen"; 

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: styles.header,
          headerTintColor: "#EEEEEE", 
          headerTitleStyle: styles.headerTitle,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: "📝 Registro" }} 
        />

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            title: "🛍️ Tienda",
            headerRight: () => <HeaderButton icon="🛒" onPress={() => navigation.navigate("Cart")} />,
          })} 
        />

        <Stack.Screen 
          name="ProductDetails" 
          component={ProductDetailsScreen} 
          options={{ title: "📄 Detalles del Producto" }} 
        />

        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={({ navigation }) => ({
            title: "🛒 Carrito de Compras",
            headerRight: () => <HeaderButton icon="📍" onPress={() => navigation.navigate("Location")} />,
          })} 
        />

        <Stack.Screen 
          name="Location" 
          component={LocationScreen} 
          options={{ title: "📍 Tu Ubicación" }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HeaderButton = ({ icon, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.headerButton}>
    <Text style={styles.headerText}>{icon}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#222831", 
    elevation: 5,
    shadowColor: "#4A90E2", 
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#EEEEEE", 
  },
  headerButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#4A90E2", 
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
