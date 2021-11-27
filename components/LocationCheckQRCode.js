import React, { useState, useEffect } from 'react';
import { Text, Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';


const finderWidth = 280;
const finderHeight = 230;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;


function LocationCheckQRCode() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
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
            <View style={{flex: 3}}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    style={StyleSheet.absoluteFillObject}
                />
                <BarcodeMask edgeColor="#62B1F6" />
            </View>
            <View style={{flex: 1}}>
                {scanned &&
                    (<TouchableOpacity onPress={() => {setScanned(false)}}
                        style={{
                        width: width,
                        height: height/4,
                        justifyContent: 'center',
                        backgroundColor:"#86ccdc",
                        }}
                    >
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 35,
                            color: "white",
                        }}>
                            Scan Again
                        </Text>
                    </TouchableOpacity>)
                }
            </View>
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export default LocationCheckQRCode;