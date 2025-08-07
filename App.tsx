import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeDefaultData } from './src/utils/storage';

const App = (): React.JSX.Element => {
  useEffect(() => {
    // Initialize default data on app startup
    initializeDefaultData();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#6200EE" />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;