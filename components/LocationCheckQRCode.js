import React, { useState, useEffect } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
// import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import { Camera } from "expo-camera";
import { Button } from "react-native-elements";
import {getVisited, appendPlaceToDate, storeVisited, currDate} from './utils/PlacesStorage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


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
      // console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
      // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      //check if data is a postal code

      //source: https://stackoverflow.com/questions/15774555/efficient-regex-for-canadian-postal-code-function
      //accept X1X 1X1, X1X-1X1, X1X1X1
      let regex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

      if(regex.test(data)){
        let places = await getVisited();
        // let date = new Date()
        // date = date.toISOString().split('T')[0];
        let date = currDate();
        let postcode = data.toUpperCase().replace('-', '').replace(' ', '');
        appendPlaceToDate(places, date, [postcode]);
        storeVisited(places)
        alert(`Location logged\n ${date}: ${postcode}`);
      }else {
        alert(`Invalid QR code\nThis QR code doesn\'t contain a valid postal code:\n ${data}`);
      }

    };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

    // return (
    //     <View style={styles.container}>
    //         <View style={{flex: 3}}>
    //             <BarCodeScanner
    //                 onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
    //                 barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
    //                 style={StyleSheet.absoluteFillObject}
    //             />
    //             <BarcodeMask edgeColor="#62B1F6" />
    //         </View>
    //         <View style={{flex: 1}}>
    //             {scanned &&
    //                 (<TouchableOpacity onPress={() => {setScanned(false)}}
    //                     style={{
    //                     width: width,
    //                     height: height/4,
    //                     justifyContent: 'center',
    //                     backgroundColor:"#86ccdc",
    //                     }}
    //                 >
    //                     <Text style={{
    //                         textAlign: 'center',
    //                         fontSize: 35,
    //                         color: "white",
    //                     }}>
    //                         Scan Again
    //                     </Text>
    //                 </TouchableOpacity>)
    //             }
    //         </View>
            
            
    //     </View>
    // );
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
      <BarcodeMask edgeColor="#62B1F6" width={280} height={280} showAnimatedLine={false} />
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
