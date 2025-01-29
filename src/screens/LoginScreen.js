import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../services/authService";
import { loadCartFromFirebase } from "../redux/cartSlice";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert("❌ Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      await loginUser(email, password);
      showAlert("✅ Inicio de sesión exitoso", "Bienvenido!");

      dispatch(loadCartFromFirebase()); // Sincronizar carrito desde Firebase

      navigation.navigate("Home");
    } catch (error) {
      showAlert("❌ Error", error?.message || "Ocurrió un error inesperado.");
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert("❌ Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      await registerUser(email, password);
      showAlert("✅ Registro exitoso", "Ahora puedes iniciar sesión.");
    } catch (error) {
      showAlert("❌ Error", error?.message || "No se pudo completar el registro.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Iniciar Sesión" onPress={handleLogin} color="#007bff" />
        <Button title="Registrarse" onPress={handleRegister} color="gray" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
