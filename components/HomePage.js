import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { LinearGradient } from 'expo-linear-gradient';
import { fontWeight } from './utils/FontWeightRender';
import HealthLogo from '../assets/heart-health.png';
import RefreshLogo from '../assets/refresh-love.png';
import RefreshLogo2 from '../assets/refresh2.png';

var styles = StyleSheet.create({
    linearGradient: {
        // flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
});

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <LinearGradient colors={['rgba(80,80,100,0.2)', 'transparent']} style={styles.linearGradient} >
                <View style={{ flex: 1, alignItems: "center", flexDirection: "column", paddingHorizontal: 15 }}>
                    <Image style={{ resizeMode: "cover", position: "absolute", width: 300, height: 300, right: -100, bottom: 0 }} source={RefreshLogo2} />
                    <Image style={{ flex: 1, height: 150, width: 150, resizeMode: 'contain' }} source={HealthLogo} />
                    <Text style={{ flex: 1 }}><Text style={{ fontSize: 25, ...fontWeight("800") }}>No exposure yet according to your routines</Text>{"\n\n"}<Text style={{ fontSize: 25, padding: 25, ...fontWeight("300") }}>We'll let you know as soon as we find you've been to an epedemic center</Text></Text>
                </View>
            </LinearGradient>
        );
    }
}

export default HomePage;