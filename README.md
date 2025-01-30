Ecommerce React Native App
Descripción
Este proyecto es una aplicación móvil de comercio electrónico desarrollada con React Native y Expo, que permite a los usuarios explorar productos, gestionar un carrito de compras, realizar pedidos, iniciar sesión y registrarse mediante Firebase Authentication. Además, integra geolocalización para mejorar la experiencia del usuario.

Instalación y configuración
Requisitos previos
Para ejecutar el proyecto, es necesario contar con las siguientes herramientas instaladas:

Node.js en su versión 16 o superior.
Expo CLI, que se puede instalar con el comando correspondiente.
Firebase, configurado en la consola de Firebase.
Pasos de instalación
Para comenzar, es necesario clonar el repositorio y acceder a la carpeta del proyecto.

Luego, se deben instalar las dependencias necesarias.

Es importante configurar Firebase. Para ello, se debe crear un archivo .env en la raíz del proyecto y agregar las credenciales correspondientes.

Finalmente, se puede ejecutar la aplicación con Expo para visualizarla en un emulador o dispositivo físico.

Estructura del proyecto
El proyecto se organiza de la siguiente manera:

La carpeta components contiene componentes reutilizables.
La carpeta navigation gestiona la configuración de navegación a través de AppNavigator.js.
La carpeta redux maneja el estado global de la aplicación mediante Redux Toolkit.
La carpeta screens contiene las pantallas principales de la aplicación.
La carpeta services almacena la conexión con Firebase y otros servicios auxiliares.
El archivo App.js representa el punto de entrada de la aplicación.
El archivo firebaseConfig.js maneja la configuración de Firebase.
Funcionalidades implementadas
Navegación entre pantallas
El archivo AppNavigator.js gestiona la navegación mediante react-navigation, lo que permite una transición fluida entre las diferentes pantallas de la aplicación.

Manejo de estado con Redux Toolkit
La aplicación gestiona su estado global con Redux Toolkit, asegurando una experiencia de usuario optimizada. El archivo cartSlice.js se encarga del manejo del estado del carrito de compras.

Persistencia de datos offline
La aplicación utiliza AsyncStorage para almacenar información localmente en el dispositivo. Esta funcionalidad, implementada en storage.js, permite que el carrito de compras se mantenga disponible incluso sin conexión a internet.

Autenticación con Firebase
El sistema de autenticación está implementado con Firebase Authentication, lo que permite a los usuarios registrarse, iniciar sesión y cerrar sesión. Las funciones correspondientes se encuentran en el archivo authService.js.

Gestión de productos y pedidos
La aplicación permite la gestión de productos y pedidos mediante Firebase Realtime Database.

El archivo databaseService.js recupera la lista de productos almacenados en Firebase.
El archivo orderService.js gestiona la creación y recuperación de pedidos.
Uso de interfaces del dispositivo
La aplicación utiliza la API de geolocalización de Expo (expo-location) para obtener la ubicación del usuario. Esta funcionalidad está implementada en locationService.js y solicita los permisos necesarios antes de acceder a la ubicación.

Compilación para Android (Opcional)
Para generar un archivo APK e instalarlo en un dispositivo Android, se debe ejecutar la instrucción correspondiente. Una vez generado el archivo, se podrá instalar en un dispositivo físico para realizar pruebas en un entorno real.

Desarrollador
Leandro Rodríguez
Correo de contacto: leandrorodriguez1130@gmail.com
Repositorio en GitHub: https://github.com/LeandroRodriguez00/Proyecto-Desarrollo-de-Aplicaciones.git

Este documento proporciona una guía clara sobre la instalación, configuración y funcionalidades del proyecto, asegurando su comprensión y facilidad de uso.







