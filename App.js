import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomePage from './components/HomePage';
import SwipeUpMenu from './components/SwipeUpMenu';

export default function App() {
  return (
    <View style={styles.container}>
      <HomePage/>
      <SwipeUpMenu/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
