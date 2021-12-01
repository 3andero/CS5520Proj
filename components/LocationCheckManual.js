import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";

function LocationCheckManual() {
  const mapRef = useRef(null);
  const [state, setState] = useState(null);
  let marker = null;

  useEffect(() => {
    const _getLocationPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status != "granted") {
        setState({ locationPermission: false });
      } else {
        setState({ locationPermission: true });
      }
    };

    const _getLocation = async () => {
      let pos = await Location.getCurrentPositionAsync({});
      console.log(
        "current location " + pos.coords.latitude + " " + pos.coords.longitude
      );
      let region = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: 0.2729186541296684,
        longitudeDelta: 0.26148553937673924,
      };
      onRegionChange(region);
      mapRef.current.animateToRegion(state.region, 2000);
    };

    setState({
      locationPermission: "unknown",
      position: "unknown",
      region: {
        latitude: 52.60254,
        latitudeDelta: 0.27291,
        longitude: 16.72187,
        longitudeDelta: 0.26148,
      },
    });

    _getLocationPermissions();

    _getLocation();

    console.log("effect");
    console.log(mapRef);
  }, []);

  const onRegionChange = (region) => {
    setState({ region });
    console.log("state: ");
    console.log(state);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        onRegionChange={onRegionChange}
        style={styles.map}
        initialRegion={{
          latitude: 52.60254,
          latitudeDelta: 0.27291,
          longitude: 16.72187,
          longitudeDelta: 0.26148,
        }}
      ></MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  overlay: {
    position: "absolute",
    bottom: 100,
  },
});

export default LocationCheckManual;
