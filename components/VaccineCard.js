import React,{useState, useEffect} from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function VaccineCard() {
    const [selectedImage, setSelectedImage] = useState(null);

    const save = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          console.log(JSON.parse(jsonValue))
          await AsyncStorage.setItem('@idCard_Key', jsonValue)
        } catch (e) {
          // saving error
        }
    }

    const load = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@idCard_Key')
        //   console.log("Load")
        //   console.log(JSON.parse(jsonValue))
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
          // error reading value
        }
    }

    const remove = async () => {
        try {
            await AsyncStorage.removeItem('@idCard_Key');
        } catch(e) {
          // error reading value
        }
    }

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
    
        setSelectedImage({ localUri: pickerResult.uri });
        // console.log(pickerResult.uri)
        save(pickerResult.uri);
    };

    useEffect(() => {
        const loadImage = async () =>{
            let uri = await load();
            // console.log("uri");
            console.log(uri);
            if (uri != null){
                setSelectedImage({ localUri: uri });
            }else {
                setSelectedImage(null);
            }
            
        }
        loadImage();
    }, []);

    if (selectedImage !== null) {
        return (
            <View style={styles.container}>
                <View  style={{flex: 7}}>
                    <Image
                        source={{ uri: selectedImage.localUri }}
                        style={styles.thumbnail}
                    />
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity onPress={openImagePickerAsync} 
                        style={{
                            width: screenWidth/2,
                            height: screenHeight/8,
                            justifyContent: 'center',
                            backgroundColor:"#3d6581",
                        }}
                    >
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 35,
                            color: "white",
                        }}>
                            Select Image
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                            setSelectedImage(null);
                            remove();
                            }
                        } 
                        style={{
                            width: screenWidth/2,
                            height: screenHeight/8,
                            justifyContent: 'center',
                            backgroundColor:"#b51b43",
                        }}
                    >
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 35,
                            color: "white",
                        }}>
                            Remove
                        </Text>
                    </TouchableOpacity>
                    </View>
            </View>
        );
    }
  
    return (
        <View style={styles.container}>
            <View style={{flex: 7,
                justifyContent: 'center',
                alignItems: 'center',
                }}
            >
                <Text style={{textAlign:'center'}}>
                    To display your <Text style={{fontWeight: "bold"}}>Photo ID</Text> here{"\n"}
                    Select an image of your ID
                </Text>
            </View>

            <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <TouchableOpacity onPress={openImagePickerAsync} 
                    style={{
                        width: screenWidth,
                        height: screenHeight/8,
                        justifyContent: 'center',
                        backgroundColor:"#3d6581",
                    }}
                >
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 35,
                        color: "white",
                    }}>Select Image</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
    //   justifyContent: "flex-end",
      alignItems: "center",
      flexDirection: "column",
      flex: 1,
    },
    thumbnail: {
        width: 300,
        height: 300,
        resizeMode: "contain",
        flex: 1,
      }
});