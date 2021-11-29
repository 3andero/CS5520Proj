import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomePage from "./components/HomePage";
import SwipeUpMenu from "./components/SwipeUpMenu";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LocationCheckQRCode from "./components/LocationCheckQRCode";
import LocationCheckManual from "./components/LocationCheckManual";
import SettingsPage from "./components/SettingsPage";
import CardPage from "./components/CardPage";
import { VaccineCardpage } from "./components/VaccineCardPage";
import { IDCardPage } from "./components/IDCardPage";
import { CALLBACK_MGR } from "./components/utils/CallbackMgr";

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <HomePage callbackMgr={CALLBACK_MGR} />
      <SwipeUpMenu callbackMgr={CALLBACK_MGR} navigation={navigation} />
      <StatusBar style="auto" />
    </View>
  );
};

const SettingsScreen = ({ navigation }) => {
  return <SettingsPage callbackMgr={CALLBACK_MGR} />;
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Camera"
          component={LocationCheckQRCode}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Map"
          component={LocationCheckManual}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="VaccCard"
          component={VaccineCardpage}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="IDCard"
          component={IDCardPage}
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
