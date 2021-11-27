import React,{useState, useEffect, useRef} from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

function LocationCheckManual() {
    const mapRef = useRef(null);
    const [state, setState] = useState(null);

    
    useEffect(() => {
        const _getLocationPermissions = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
        
            if (status != "granted") {
              setState({ locationPermission: false });
            } else {
              setState({ locationPermission: true });
            }
        };
        _getLocationPermissions();
        setState({
            locationPermission: "unknown",
            position: "unknown",
            region: {
                latitude: 52.60254,
                latitudeDelta: 0.27291,
                longitude: 16.72187,
                longitudeDelta: 0.26148,
            }
        });
        console.log("Work");
    }, []);

    return (
        <MapView
            // onRegionChange={onRegionChange}
            style={styles.map}
            initialRegion={{
                latitude: 52.60254,
                latitudeDelta: 0.27291,
                longitude: 16.72187,
                longitudeDelta: 0.26148,
            }}
            ref={mapRef}
        >
            <Marker
                key={0}
                coordinate={{
                latitude: 52.60254,
                longitude: 16.72187,
                }}
            />
        </MapView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default LocationCheckManual;