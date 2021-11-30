import React, { Component } from "react";
import { View, Image, Alert, TouchableOpacity, Dimensions, Text } from "react-native";
import { Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { getData, storeData } from "./utils/Storage";

const GREY = "#A0A2A0";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ALBUM_NAME = "Exposure";
class CardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      imageStored: null,
    };
  }

  componentDidMount() {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Error",
            "Sorry, we need camera roll permissions to make this work!"
          );
        }
      }
    })();
    this.loadImageFromURI(this.props.keyName).then((val) => {
      this.setState({ imageStored: val });
    });
  }

  saveImageURI = async (key, item) => {
    await storeData(key, item);
  };

  saveImageToAlbum = async (item) => {
    // Remember, here item is a file uri which looks like this. file://..
    const permission = await MediaLibrary.requestPermissionsAsync(false);
    if (permission.granted) {
      try {
        const asset = await MediaLibrary.createAssetAsync(item);
        let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
        if (album) {
          MediaLibrary.addAssetsToAlbumAsync(asset, album, false).catch(() => {
            Alert.alert("Error", "Cannot save photos");
          });
        } else {
          MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false).catch(() => {
            Alert.alert("Error", "Cannot save photos");
          });
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Cannot save photos: " + error && error.toString()
        );
      }
    } else {
      Alert.alert("Error", "No permission to save photos");
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      await this.saveImageURI(this.props.keyName, result.uri);
    }
  };

  loadImageFromURI = async (key) => {
    return await getData(key);
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "column-reverse" }}>
        {/* <Button
          buttonStyle={{
            backgroundColor: GREY,
            height: 65,
            borderColor: "white",
          }}
          title={"Press to Load"}
          titleStyle={{
            fontWeight: "bold",
          }}
          onPress={this.pickImage}
        /> */}
        <TouchableOpacity onPress={this.pickImage} 
          style={{
                  width: screenWidth,
                  height: screenHeight/8,
                  justifyContent: 'center',
                  backgroundColor:"#3d6581",
                }}
        >
          <Text style={{textAlign: 'center',
                        fontSize: 35,
                        color: "white",
                      }}>
            Select Image
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {(this.state.image || this.state.imageStored) && (
            <Image
              source={{ uri: this.state.image || this.state.imageStored }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          )}
        </View>
      </View>
    );
  }
}

export default CardPage;
