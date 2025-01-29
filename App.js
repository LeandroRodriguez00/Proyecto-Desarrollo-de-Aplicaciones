import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/redux/store';
import { fetchCartFromStorage } from './src/services/storage';

export default function App() {
  useEffect(() => {
    const initializeStorage = async () => {
      await fetchCartFromStorage();
    };

    initializeStorage();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
