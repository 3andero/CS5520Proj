import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import BarcodeMask from "react-native-barcode-mask";
import { Camera } from "expo-camera";
import { Button } from "react-native-elements";
import {
  getVisited,
  appendPlaceToDate,
  storeVisited,
  currDate,
} from "./utils/PlacesStorage";

function LocationCheckQRCode() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    //check if data is a postal code

    //source: https://stackoverflow.com/questions/15774555/efficient-regex-for-canadian-postal-code-function
    //accept X1X 1X1, X1X-1X1, X1X1X1
    let regex =
      /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

    if (regex.test(data)) {
      let places = await getVisited();
      let date = currDate();
      let postcode = data.toUpperCase().replace("-", "").replace(" ", "");
      postcode = postcode.substr(0, 3) + " " + postcode.substr(3);
      appendPlaceToDate(places, date, [postcode]);
      storeVisited(places);
      alert(`Location logged\n ${date}: ${postcode}`);
    } else {
      alert(
        `Invalid QR code\nThis QR code doesn\'t contain a valid postal code:\n ${data}`
      );
    }
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
      <BarcodeMask
        edgeColor="#62B1F6"
        width={280}
        height={280}
        showAnimatedLine={false}
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
