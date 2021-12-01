import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

class GPSComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationPermission: "unknown",
      position: "unknown",
      region: {
        latitude: 52.60254,
        latitudeDelta: 0.27291,
        longitude: 16.72187,
        longitudeDelta: 0.26148,
      },
    };
    this.onRegionChange = this.onRegionChange.bind(this);
    this.current();
  }

  current() {
    this.getLocation();
  }
  onRegionChange(region) {
    this.setState({
      region,
    });
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  //After calling this function, current location is stored/updated locally.
  // Can be accessed through "currentLocation".
  getLocation() {
    (async () => {
      let pos = await Location.getCurrentPositionAsync({});
      let coords = pos.coords.latitude + ", " + pos.coords.longitude;
      let temp = { ...this.state.region };
      temp.latitude = pos.coords.latitude;
      temp.longitude = pos.coords.longitude;
      AsyncStorage.setItem("currentLocation", JSON.stringify(temp));
      console.log("current location" + JSON.stringify(temp));
      this.setState({ region: temp });
      this.map.animateToRegion(temp, 1000);
    })();
  }
  random() {}
  _getLocationPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status != "granted") {
      this.setState({ locationPermission: false });
    } else {
      this.setState({ locationPermission: true });
    }
  };

  componentDidMount() {
    this._getLocationPermissions();
  }
  //Inside marker, put your active locations.
  render() {
    return (
      <View style={styles.container}>
        <MapView
          onRegionChange={this.onRegionChange}
          style={styles.map}
          initialRegion={this.state.region}
          ref={(ref) => {
            this.map = ref;
          }}
        >
          <Marker
            key={0}
            coordinate={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
            }}
          />
        </MapView>
        <Button
          title="I AM HERE"
          style={styles.button}
          onPress={() => {
            //this.current();
            this.getLocation();
          }}
        ></Button>
        <Button
          title="Check"
          style={styles.button}
          onPress={() => {
            this.random();
          }}
        ></Button>
        <Text></Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: "absolute",
    bottom: 100,
    top: 50,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
export default GPSComponent;
