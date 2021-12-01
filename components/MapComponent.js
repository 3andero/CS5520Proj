import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  extractSummary,
  getCurrentLocationAndStore,
  getDetailedLocation,
} from "./utils/ZipCode";
import { getEpiCenter } from "./utils/PlacesStorage";
import { Alert } from "react-native";
import { CALLBACK_MGR } from "./utils/CallbackMgr";

const INIT_REGION = {
  latitude: 50.60254331180157,
  longitude: 16.721875704824924,
};

const DELTAS = {
  latitudeDelta: 0.2729186541296684,
  longitudeDelta: 0.26148553937673924,
};

export default class MapComponent extends Component {
  constructor(props) {
    super(props);
    let defaultLoc = CALLBACK_MGR.getCachedLocation();
    let loaded = !!defaultLoc;
    defaultLoc = defaultLoc || INIT_REGION;
    let region = {
      ...defaultLoc,
      ...DELTAS,
    };

    this.state = {
      region: region,
      currentRegion: { ...region },
      loaded: loaded,
      exposedLocation: [],
    };
    this.currentLocation = this.currentLocation.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.addMarker = this.addMarker.bind(this);
  }

  currentLocation() {
    getCurrentLocationAndStore().then(([ok, coordinate]) => {
      if (!ok) {
        Alert.alert("Error", "Unable to get current loaction, no permission");
        return;
      }
      if (!this || !this._ismounted) {
        return;
      }
      let newRegion = {
        ...coordinate,
        ...DELTAS,
      };
      this.setState({ currentRegion: newRegion });
      this.animateChange(newRegion);
      this.setState({ loaded: true });
    });
  }

  loadLocation() {
    (async () => {
      let exposedLocation = [];
      let exposedPostCode = await getEpiCenter();
      for (const [key, codes] of Object.entries(exposedPostCode)) {
        for (const [key, value] of Object.entries(codes)) {
          let [details, coords] = await getDetailedLocation(value);
          if (coords) {
            exposedLocation.push([value, coords, details]);
          }
        }
      }
      this.setState({ exposedLocation });
    })();
  }

  addMarker() {
    if (this.state.loaded) {
      let markerList = this.state.exposedLocation.map(
        ([zip, loc, details], i) => (
          // add marker of at-risk area here
          <Marker
            key={zip}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            title={zip + " (at risk)"}
            description={extractSummary(details)}
          />
        )
      );
      return markerList;
    }
  }

  componentDidMount() {
    this.loadLocation();
    this.currentLocation();
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  animateChange(region) {
    this.mapView && this.mapView.animateToRegion(region, 2000);
    this.onRegionChange(region);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => (this.mapView = ref)}
          initialRegion={this.state.region}
          onRegionChange={this.onRegionChange}
          style={styles.map}
        >
          {this.addMarker()}
          {this.state.loaded && (
            <Marker
              coordinate={{
                longitude: this.state.currentRegion.longitude,
                latitude: this.state.currentRegion.latitude,
              }}
              title="Current Location"
              image={require("../assets/current-location-128px.png")}
            />
          )}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: "absolute",
    bottom: 100,
  },
});
