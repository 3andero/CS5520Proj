import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { Button } from "react-native-elements";

function LocationCheckQRCode() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        ratio={"16:9"}
        style={{
          flex: 1,
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
        }}
      />
      <View style={{ flex: 10 }} />
      {scanned && (
        <Button
          containerStyle={{ flex: 1, alignItems: "center" }}
          buttonStyle={{
            height: 40,
            marginBottom: 20,
            borderRadius: 20,
            paddingHorizontal: 20,
          }}
          title={"Tap to Scan Again"}
          titleStyle={{ fontWeight: "bold" }}
          onPress={() => setScanned(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default LocationCheckQRCode;
