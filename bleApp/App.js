/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import AppNavigation from './src/navigations';
import GlobalProvider from './src/context/Provider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return <SafeAreaProvider> 
    <GlobalProvider>
      <AppNavigation/>
    </GlobalProvider>
  </SafeAreaProvider>;
};

export default App;
