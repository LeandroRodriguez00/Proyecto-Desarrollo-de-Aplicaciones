import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator, 
} from "react-native";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../services/authService";
import { loadCartFromFirebase } from "../redux/cartSlice";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch();

  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert("Error", "Todos los campos son obligatorios.");
      return;
    }

    setLoading(true); 

    try {
      await loginUser(email, password);
      showAlert("Inicio de sesión exitoso", "Bienvenido!");

      dispatch(loadCartFromFirebase());

      navigation.navigate("Home");
    } catch (error) {
      showAlert("Error", error?.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false); 
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      await registerUser(email, password);
      showAlert("Registro exitoso", "Ahora puedes iniciar sesión.");
    } catch (error) {
      showAlert("Error", error?.message || "No se pudo completar el registro.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/6537937.jpg")} style={styles.logo} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>🔐 Iniciar Sesión</Text>

          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#C4C4C4"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#C4C4C4"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          {}
          {loading ? (
            <ActivityIndicator size="large" color="#4A90E2" />
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>🚀 Iniciar Sesión</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.buttonText}>📝 Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2F",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: "#4A90E2",
    resizeMode: "cover",
  },
  formContainer: {
    backgroundColor: "#2E3A46",
    width: "100%",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EEEEEE",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    backgroundColor: "#3A4B5C",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#4A90E2",
  },
  loginButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  registerButton: {
    backgroundColor: "#6C757D",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
