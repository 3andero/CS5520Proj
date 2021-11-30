import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Button, Text, View, Dimensions } from 'react-native';
import * as Permissions from 'expo';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { getLocation, getZipCode } from './utils/ZipCode';
import { getEpiCenter, getVisited , currDate, appendPlaceToDate, storeVisited } from './utils/PlacesStorage';

const { width, height } = Dimensions.get("screen");

export default class MapComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            region:{
                latitude: 50.60254331180157,
                longitude: 16.721875704824924,
                latitudeDelta: 0.2729186541296684,
                longitudeDelta: 0.26148553937673924,
            },
            currentRegion: null,
            loaded: false,
            locationPermission: 'unknown',
            exposedLocation: [],        
        }
        this.currentLocation = this.currentLocation.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);
        this.addMarker = this.addMarker.bind(this);
    }

    _getLocationPermissions = async() => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted'){
            this.setState({
                locationPermission: false,
            });
        } else {
            this.setState({
                locationPermission: true,
            });
        }
    };

    currentLocation(){
        this._getLocationPermissions();
        (async () => {
                let position = await Location.getCurrentPositionAsync({});
                // console.log("My Position:\t" + position.coords.latitude + ',' + position.coords.longitude);
                let newRegion = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.2729186541296684,
                    longitudeDelta: 0.26148553937673924,
                };
                this.setState({currentRegion: newRegion})
                this.animateChange(newRegion);
                // console.log(this.state)
                this.setState({loaded: true});

                let places = await getVisited();
                let date = currDate();
                let postcode = await getZipCode(newRegion.longitude, newRegion.latitude);
                appendPlaceToDate(places, date, [postcode]);
                storeVisited(places)
            } 
        )();      
    }

    loadLocation(){
        (async () => {
            let exposedLocation = []
            let exposedPostCode = await getEpiCenter();
            // console.log("Post Code");
            // console.log(exposedPostCode);
            for (const [key, codes] of Object.entries(exposedPostCode)) {
                for (const [key, value] of Object.entries(codes)) {
                    
                    let coords = await getLocation(value);
                    // console.log(coords);
                    exposedLocation.push([value, coords]);
                }
            }
            // console.log("Exposed Location");
            // console.log(exposedLocation);
            this.setState({exposedLocation});
            
        })();
    }

    addMarker(){
        if (this.state.loaded){
            // console.log(this.state.exposedLocation);

            let markerList = this.state.exposedLocation.map((loc, i) => (
                // add marker of at-risk area here 
                    <Marker 
                        key={ loc[0] }
                        coordinate={{
                            latitude: loc[1].latitude,
                            longitude: loc[1].longitude,
                        }}
                        title= {loc[0]}
                    />
            ));
            // console.log(markerList);
            return markerList;
        }
    }
    
    componentDidMount(){
        this.loadLocation();
        this.currentLocation();
    }

    animateChange(region){
        this.mapView.animateToRegion(region, 2000);
        this.onRegionChange(region);
    }

    onRegionChange(region){   
        this.setState({region})
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    ref = {(ref)=>this.mapView=ref}
                    initialRegion={this.state.region}
                    onRegionChange={this.onRegionChange}
                    style={styles.map}
                >
                    {this.addMarker()}
                    {this.state.loaded &&
                        <Marker
                        coordinate={{
                        longitude: this.state.currentRegion.longitude,
                        latitude: this.state.currentRegion.latitude
                        }}
                        title="Current Location"
                        image={require('../assets/current-location-128px.png')}
                        />
                    }
                </MapView>
                    
                {/* <Button
                    style={styles.overlay}
                    onPress={this.currentLocation}
                    title="Current"
                /> */}
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        // width,
        // height,
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        
    },    
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        position: 'absolute',
        bottom: 100,
        // backgroundColor: 'rgba(255, 255, 255, 1)',

    },
})