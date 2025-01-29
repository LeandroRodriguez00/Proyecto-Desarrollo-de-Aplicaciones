import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../services/authService";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const navigation = useNavigation();

  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !zipCode.trim()) {
      showAlert("❌ Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      await registerUser(email, password, fullName, phone, address, city, zipCode);
      showAlert("✅ Registro exitoso", "Ahora puedes iniciar sesión.");
      navigation.navigate("Login");
    } catch (error) {
      showAlert("❌ Error", error?.message || "No se pudo completar el registro.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* 🔥 IMAGEN MÁS GRANDE */}
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/register.jpg")} style={styles.logo} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>📝 Crear Cuenta</Text>

          <TextInput
            placeholder="Nombre y Apellido"
            placeholderTextColor="#C4C4C4"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#C4C4C4"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#C4C4C4"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            placeholder="Número de Teléfono"
            placeholderTextColor="#C4C4C4"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            placeholder="Dirección"
            placeholderTextColor="#C4C4C4"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />

          <TextInput
            placeholder="Ciudad"
            placeholderTextColor="#C4C4C4"
            value={city}
            onChangeText={setCity}
            style={styles.input}
          />

          <TextInput
            placeholder="Código Postal"
            placeholderTextColor="#C4C4C4"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity 
            style={styles.registerButton} 
            activeOpacity={0.8} 
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>✅ Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton} 
            activeOpacity={0.8} 
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>🔙 Volver al Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: "100%",  
    height: 300,    
    resizeMode: "contain",
  },
  formContainer: {
    backgroundColor: "#2E3A46",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    width: "100%",
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
  registerButton: {
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
  backButton: {
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
