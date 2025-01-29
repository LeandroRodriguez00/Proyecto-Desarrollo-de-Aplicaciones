import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuración de Firebase (¡Usar variables de entorno para producción!)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,  
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Inicializar Firebase App (evitar múltiples instancias)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Configurar Firebase Authentication con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicializar Firebase Database
const database = getDatabase(app);

// Exportar módulos de Firebase
export { auth, database };
export default app;
