import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomePage from './components/HomePage';
import SwipeUpMenu from './components/SwipeUpMenu';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationCheckQRCode from './components/LocationCheckQRCode';
import LocationCheckManual from './components/LocationCheckManual';

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {

  var mgr = { callback: () => { } };
  return (
    <View style={styles.container}>
      <HomePage callbackMgr={mgr} />
      <SwipeUpMenu callbackMgr={mgr} navigation={navigation} />
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Camera"
          component={LocationCheckQRCode}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="Map"
          component={LocationCheckManual}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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