import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Button, Text, View, Dimensions } from 'react-native';
import * as Permissions from 'expo';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

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
            marker: [],         
        }
        this.currentLocation = this.currentLocation.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);
        this.addMarker = this.addMarker.bind(this);
    }

    _getLocationPermissions = async() => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        console.log(status);
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
                console.log("Here")
                console.log("My Position:\t" + position.coords.latitude + ',' + position.coords.longitude);
                let newRegion = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.2729186541296684,
                    longitudeDelta: 0.26148553937673924,
                };
                this.setState({currentRegion: newRegion})
                this.animateChange(newRegion);
                console.log(this.state)
                this.setState({loaded: true});
            } 
        )();      
    }

    addMarker(){
        if (this.state.loaded){
            return(
                // add marker of infected area here
                <Marker 
                    coordinate={{
                        longitude: 16.721875704824924,
                        latitude: 50.60254331180157
                    }}
                    title="A Marker"
                />
            );
        }
    }

    add
    
    componentDidMount(){
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
                    {this.addMarker()}
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