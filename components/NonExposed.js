import React, { Component } from "react";
import { View } from "react-native";

class NonExposed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <View></View>;
  }
}

export default NonExposed;
