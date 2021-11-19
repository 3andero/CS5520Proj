import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import LocationCheck from './LocationCheck';
import VaccineCard from './VaccineCard';
import BottomDrawer from './utils/BottomDrawer';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import PropTypes from 'prop-types';
import { fontWeight } from './utils/FontWeightRender';

const TAB_BAR_HEIGHT = 100;

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const UP_HEIGHT = SCREEN_HEIGHT - 100;
const ACTUAL_DOWN_HEIGHT = 80;
const DOWN_HEIGHT = UP_HEIGHT - ACTUAL_DOWN_HEIGHT;


class SwipeUpMenu extends Component {
    static propTypes = {
        callbackMgr: PropTypes.object,
    }

    static defaultProps = {
        callbackMgr: { callback: () => { } }
    }

    constructor(props) {
        super(props);
        this.state = {
            swipePercentage: 0,
        };
    }

    buttonWidth(perc, x) {
        return 100 + 200 * Math.pow(perc, x);
    }

    buttonMargin(perc) {
        return 25 * (1 - perc) + perc * (SCREEN_WIDTH - this.buttonWidth(1, 1)) / 2;
    }

    buttonHeight(perc) {
        return 50 + 20 * perc;
    }

    titleMarginV(perc) {
        return 27 + perc * 19;
    }

    buttonTopMargin(perc) {
        return perc * 100;
    }

    textMarginH(perc) {
        return 25 * (1 - perc) + perc * (10 + SCREEN_WIDTH - (100 + 180)) / 2;
    }

    iconSize(perc) {
        return 25 + perc * 5;
    }

    buttonBelowMargin(perc) {
        return (1 - perc) * 100;
    }

    renderContent = () => {
        var perc = this.state.swipePercentage;
        const buttonStyle = { ...styles.buttonStyle, height: this.buttonHeight(perc) };

        return (
            <View style={{ flex: 1, flexDirection: "column", alignItems: "center", elevation: 4, }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={styles.contentView}>
                        <Text style={{
                            flex: 1,
                            padding: 30,
                            paddingVertical: this.titleMarginV(perc), paddingHorizontal: this.textMarginH(perc)
                        }}>{<Text style={{
                            color: "green",
                            fontSize: 20 + 7 * perc,
                            ...fontWeight(300 + Math.floor(perc * 2.2) * 100)
                        }}>
                            COVID Alert is </Text>}
                            <Text style={{
                                color: "green", fontSize: 20 + 7 * perc, ...fontWeight(600 + Math.floor(perc * 3.5) * 100)
                            }}>Active
                            </Text>
                        </Text>
                    </View>
                    <View style={styles.contentView}>
                        <View style={{ flex: 1, flexDirection: "column", alignItems: "flex-end" }}>
                            <View style={{
                                height: this.buttonTopMargin(perc),
                                flex: 1,
                            }} />
                            <Button
                                icon={
                                    <Icon name="camera" size={this.iconSize(perc)} color="white" />
                                }
                                title="SCAN"
                                buttonStyle={buttonStyle}
                                containerStyle={{
                                    width: this.buttonWidth(perc, 2.7),
                                    marginHorizontal: this.buttonMargin(perc),
                                    marginVertical: 15,
                                }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={() => this.props.navigation.navigate('Camera')}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ height: this.buttonTopMargin(perc) }} />
                <View style={{ flex: 1, alignSelf: "flex-end" }}>
                    <Button
                        icon={
                            <Icon name="map" size={this.iconSize(perc)} color="white" />
                        }
                        title="LOOK UP"
                        buttonStyle={buttonStyle}
                        containerStyle={{
                            width: this.buttonWidth(perc, 1.8),
                            marginHorizontal: this.buttonMargin(perc),
                            marginVertical: 15,
                        }}
                        titleStyle={{ fontWeight: 'bold' }}
                        onPress={() => this.props.navigation.navigate('Map')}
                    />
                </View>
                <View style={{ flex: 1, alignSelf: "flex-end" }}>
                    <Button
                        icon={
                            <Icon name="healing" size={this.iconSize(perc)} color="white" />
                        }
                        title="VACCINE CARD"
                        buttonStyle={buttonStyle}
                        containerStyle={{
                            width: this.buttonWidth(perc, 1.5),
                            marginHorizontal: this.buttonMargin(perc),
                            marginVertical: 15,
                        }}
                        titleStyle={{ fontWeight: 'bold' }}
                    />
                </View>
                <View style={{ flex: 1, alignSelf: "flex-end" }}>
                    <Button
                        icon={
                            <Icon name="info" size={this.iconSize(perc)} color="white" />
                        }
                        title="COVID INFO"
                        buttonStyle={buttonStyle}
                        containerStyle={{
                            width: this.buttonWidth(perc, 1.1),
                            marginHorizontal: this.buttonMargin(perc),
                            marginVertical: 15,
                        }}
                        titleStyle={{ fontWeight: 'bold' }}
                    />
                </View>
                <View style={{ flex: 1, alignSelf: "flex-end" }}>
                    <Button
                        icon={
                            <Icon name="settings" size={this.iconSize(perc)} color="white" />
                        }
                        title="SETTINGS"
                        buttonStyle={buttonStyle}
                        containerStyle={{
                            width: this.buttonWidth(perc, 0.8),
                            marginHorizontal: this.buttonMargin(perc),
                            marginVertical: 15,
                        }}
                        titleStyle={{ fontWeight: 'bold' }}
                    />
                </View>
                <View style={{ marginVertical: this.buttonBelowMargin(perc), height: 100 }} />
            </View>
        )
    }

    render() {
        return (
            <BottomDrawer
                containerHeight={UP_HEIGHT}
                downDisplay={DOWN_HEIGHT}
                startUp={false}
                onSwiping={(perc, dy) => {
                    perc = 1 - perc;
                    this.props.callbackMgr.callback(perc, dy);
                    perc = Math.max(Math.round(perc * 400) / 400, 0);
                    this.setState({ swipePercentage: perc });
                }}
            >
                {this.renderContent()}
            </BottomDrawer>
        )
    }
}

const styles = StyleSheet.create({
    contentView: {
        position: "absolute",
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    buttonPlaceHolder: {
        width: 50,
        height: 50,
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
    buttonStyle: {
        backgroundColor: 'black',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
    }
});

export default SwipeUpMenu;
