import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fontWeight } from './utils/FontWeightRender';
import HealthLogo from '../assets/heart-health.png';
import RefreshLogo2 from '../assets/refresh2.png';
import RiskLogo from '../assets/medium-risk.png';
import DoctorLogo2 from '../assets/doctor3.png';
import PropTypes from 'prop-types';
import AppLoading from 'expo-app-loading';
import { Button } from 'react-native-elements';


var styles = StyleSheet.create({
    linearGradient: {
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        width: '100%', height: '100%'
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

class SafePage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        var rotate1 = this.props.percentage;
        rotate1 = Math.round(rotate1 * 1000) / 1000;
        var rotate2 = (this.props.percentage > 0.1 || this.props.direction < 0) ? 0 : this.props.percentage;
        rotate2 = Math.abs(rotate2 * (rotate2 - 0.1)) * 1800;
        return (<View style={{ flex: 1, alignItems: "center" }}>
            <Image style={{ resizeMode: "cover", position: "absolute", width: 300, height: 300, right: -100, bottom: 0, transform: [{ rotate: (rotate1 * 480).toString() + "deg" }] }} source={RefreshLogo2} />
            <Image style={{ flex: 6.5, height: 150, width: 150, resizeMode: 'contain', transform: [{ rotate: rotate2.toString() + "deg" }] }} source={HealthLogo} />
            <Text style={{ flex: 8 }}><Text style={{ fontSize: 25, ...fontWeight("800") }}>No exposure yet according to your routines</Text>{"\n\n"}<Text style={{ fontSize: 25, padding: 25, ...fontWeight("300") }}>We'll let you know as soon as we find you've been to an epedemic center</Text></Text>
        </View>);
    }
}

class UnsafePage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        var rotate2 = (this.props.percentage > 0.1 || this.props.direction < 0) ? 0 : this.props.percentage;
        rotate2 = (Math.abs(rotate2 * (rotate2 - 0.1))) * 1800;

        var buttonPercentage = (Math.floor((1 - this.props.percentage) * 1000) / 10).toString() + "%";

        var h = 150 + rotate2 * 1;
        var w = 150 + rotate2 * 1;
        return (<View style={{ flex: 1, alignItems: "center" }}>
            <Image style={{ resizeMode: "cover", position: "absolute", width: 300, height: 300, right: -100, bottom: 40, transform: [{ rotate: ((rotate2 + 15)).toString() + "deg" }] }} source={RiskLogo} />
            <Image style={{ flex: 6, height: h, width: w, resizeMode: 'contain', marginVertical: 20 }} source={DoctorLogo2} />
            <Text style={{ flex: 4, }}><Text style={{ fontSize: 27, ...fontWeight("900"), color: "darkred" }}>Potential exposure</Text>{"\n\n"}<Text style={{ fontSize: 25, padding: 25, ...fontWeight("300") }}>According to your record, you might have exposed at {this.props.exposure.location.toString()}</Text></Text>
            {<View style={{
                flex: 4,
                alignItems: "center",
            }}><Button
                    title={"See Next Steps"}
                    titleStyle={{ fontWeight: 'bold', fontSize: 18 }}
                    buttonStyle={{
                        backgroundColor: 'slategray',
                        borderWidth: 3,
                        borderColor: 'white',
                        borderRadius: 30,
                    }}
                    containerStyle={{
                        width: 200,
                        marginHorizontal: 50,
                        marginVertical: 10,
                    }}
                    icon={{
                        name: 'arrow-right',
                        type: 'font-awesome',
                        size: 15,
                        color: 'white',
                    }}
                    iconRight
                    iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
                /></View>}
        </View>);
    }
}

class HomePage extends Component {
    static propTypes = {
        callbackMgr: PropTypes.object,
    }

    static defaultProps = {
        callbackMgr: { callback: {} }
    }

    constructor(props) {
        super(props);
        this.state = { percentage: 0, direction: 0, isReady: false, exposure: { isExposed: false, location: ["place1", "place2"] } };
        props.callbackMgr.callback = (x, dy) => {
            this.setState({ percentage: x, direction: dy });
        }
    }

    async _updateContactInfo() {
        return await new Promise((r) => setTimeout(r, 1000));
    }

    render() {
        if (!this.state.isReady) {
            return (<View>
                <ActivityIndicator size="large" />
                <AppLoading
                    startAsync={this._updateContactInfo}
                    onFinish={() => this.setState({ isReady: true })}
                    onError={console.warn}
                >
                </AppLoading>
            </View>);
        }


        return (
            <LinearGradient colors={['rgba(80,80,100,0.2)', 'transparent']} style={styles.linearGradient} >
                <View style={{ flex: 1, alignItems: "center", flexDirection: "column", paddingHorizontal: 15 }}>
                    {!this.state.exposure.isExposed ?
                        <SafePage percentage={this.state.percentage} direction={this.state.direction} />
                        : <UnsafePage percentage={this.state.percentage} direction={this.state.direction} exposure={this.state.exposure} />}
                </View>
            </LinearGradient>
        );
    }
}

export default HomePage;