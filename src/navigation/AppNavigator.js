import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import CartScreen from "../screens/CartScreen";
import LocationScreen from "../screens/LocationScreen";
import LoginScreen from "../screens/LoginScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({
            title: "Tienda",
            headerRight: () => <HeaderButton icon="🛒" onPress={() => navigation.navigate("Cart")} />,
          })} 
        />

        <Stack.Screen 
          name="ProductDetails" 
          component={ProductDetailsScreen} 
          options={{ title: "Detalles del Producto" }} 
        />

        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={({ navigation }) => ({
            title: "Carrito de Compras",
            headerRight: () => <HeaderButton icon="📍" onPress={() => navigation.navigate("Location")} />,
          })} 
        />

        <Stack.Screen 
          name="Location" 
          component={LocationScreen} 
          options={{ title: "Tu Ubicación" }} 
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
  headerButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 20,
  },
});
