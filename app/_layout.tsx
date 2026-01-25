import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { RootApp } from '../src/RootApp';
import { store } from '../src/store/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <RootApp />
    </Provider>
  );
}