import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomePage from "./components/HomePage";
import SwipeUpMenu from "./components/SwipeUpMenu";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LocationCheckQRCode from "./components/LocationCheckQRCode";
import MapComponent from "./components/MapComponent";
import SettingsPage from "./components/SettingsPage";
import { VaccineCardpage } from "./components/VaccineCardPage";
import { IDCardPage } from "./components/IDCardPage";

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <HomePage />
      <SwipeUpMenu navigation={navigation} />
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={LocationCheckQRCode}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Map"
          component={MapComponent}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Vaccine Card"
          component={VaccineCardpage}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ID Card"
          component={IDCardPage}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsPage}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
