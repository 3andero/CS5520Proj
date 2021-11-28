import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  TouchableHighlight,
  Alert,
  Modal,
} from "react-native";
import {
  ListItem,
  Divider,
  Input,
  Icon,
  Switch,
  Button,
} from "react-native-elements";

import * as Notifications from "expo-notifications";

const ORANGE = "#FF9500";
const BLUE = "#007AFF";
const GREEN = "#4CD964";
const RED = "#FF3B30";
const GREY = "#8E8E93";
const PURPLE = "#5856D6";
const TEAL_BLUE = "#5AC8FA";
const BLACK = "#203030";

const BORDER_RADIUS = 15;
const ICON_SIZE = 28;
const ITEM_MARGIN = 20;

const COVID_ALERT_BOX = 0;
const DEBUG_MODE_BOX = 1;
const EXPOSE_STATUS_BOX = 2;
const NOTIFICATION_BUTTON = 3;

async function requestNotificationPermission() {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
}

const onSubmit = (val) => {
  requestNotificationPermission().then(() => {
    notify(val);
  });
};

const notify = (val) => {
  if (!val) {
    val = 0;
  }
  if (val <= 0) {
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: true,
          // shouldPlaySound: true,
          // shouldSetBadge: true,
        };
      },
    });
  }
  const schedulingOptions = {
    content: {
      title: "This is a notification",
      body: "This is the body",
      sound: true,
      color: "blue",
      data: { data: "goes here" },
    },
    trigger:
      val <= 0
        ? null
        : {
            seconds: val,
          },
  };
  // Notifications show only when app is not active.
  // (ie. another app being used or device's screen is locked)
  Notifications.scheduleNotificationAsync(schedulingOptions);
  console.log("scheduling notification");
  console.log(schedulingOptions);
};

const sections = [
  {
    data: [
      {
        title: "Covid Alert",
        icon: "alert",
        backgroundColor: [ORANGE, GREEN],
        hideChevron: true,
        stateIndex: 0,
        checkBox: true,
        type: "ionicon",
      },
      {
        title: "Debug Mode",
        icon: "bug",
        backgroundColor: [GREY, BLACK],
        hideChevron: true,
        stateIndex: DEBUG_MODE_BOX,
        checkBox: true,
        type: "ionicon",
      },
    ],
  },
  {
    data: [
      {
        title: "Reset",
        backgroundColor: BLUE,
        icon: "reload",
        type: "ionicon",
        onPress: () => {
          Alert.alert(
            "Warning",
            "Do you want to reset your vaccine card and ID?",
            [
              { text: "Cancel", onPress: () => {}, style: "cancel" },
              { text: "Yes", onPress: () => {}, style: "default" },
            ]
          );
        },
      },
      {
        title: "Privacy",
        icon: "lock-closed",
        backgroundColor: RED,
        type: "ionicon",
        onPress: () => {},
      },
    ],
  },
  {
    debugOnly: true,
    data: [
      {
        title: "Exposure Status",
        icon: "coronavirus",
        backgroundColor: [GREEN, RED],
        hideChevron: true,
        rightTitle: ["Safe", "Exposed"],
        stateIndex: 2,
        checkBox: true,
        type: "MaterialIcons",
      },
      {
        title: "Exposure Notification",
        icon: "notifications",
        backgroundColor: GREY,
        hideChevron: true,
        type: "MaterialIcons",
        // onPress: onSubmit,
        stateIndex: NOTIFICATION_BUTTON,
      },
    ],
  },
  { data: [] },
];

const CheckBoxes = {
  [COVID_ALERT_BOX]: {
    onPress: (props0, val) => {
      props0.callbackMgr.alertStatusCallback(val);
    },
    defaultVal: (props0) => props0.callbackMgr.alertStatus(),
  },
  [DEBUG_MODE_BOX]: {
    onPress: (props0, val) => {},
    defaultVal: (props0) => false,
  },
  [EXPOSE_STATUS_BOX]: {
    onPress: (props0, val) => {
      props0.callbackMgr.isExposedCallback(val);
    },
    defaultVal: (props0) => props0.callbackMgr.isExposed(),
  },
  [NOTIFICATION_BUTTON]: {
    onPress: (props0, val) => {},
    defaultVal: (props0) => false,
  },
};

const SettingsPage = (props0) => {
  const switched = [];
  const setSwitched = [];
  for (let index = 0; index < Object.keys(CheckBoxes).length; index++) {
    let [v, s] = useState(CheckBoxes[index].defaultVal(props0));
    switched.push(v);
    setSwitched.push(s);
  }

  const renderItem = ({
    item: {
      title,
      backgroundColor,
      icon,
      rightTitle,
      hideChevron,
      stateIndex,
      type,
      onPress,
      checkBox,
    },
    index,
    section: { data: sdata },
  }) => {
    let style = {
      ...(index == 0 && {
        borderTopLeftRadius: BORDER_RADIUS,
        borderTopRightRadius: BORDER_RADIUS,
      }),
      ...(index == sdata.length - 1 && {
        borderBottomLeftRadius: BORDER_RADIUS,
        borderBottomRightRadius: BORDER_RADIUS,
      }),
    };

    const comp = (props) => (
      <TouchableHighlight
        style={{ ...style, marginHorizontal: ITEM_MARGIN }}
        onPress={() => {
          stateIndex && setSwitched[stateIndex](!switched[stateIndex]);
          props.onPress &&
            props.onPress(props0, stateIndex && switched[stateIndex]);
        }}
        disabled={checkBox}
      >
        {props.children}
      </TouchableHighlight>
    );

    return (
      <ListItem
        containerStyle={{ paddingVertical: 8, ...style }}
        key={title}
        onPress={onPress}
        Component={comp}
      >
        <Icon
          type={type}
          name={icon}
          size={20}
          color="white"
          containerStyle={{
            backgroundColor:
              (Array.isArray(backgroundColor) &&
                backgroundColor[Number(switched[stateIndex])]) ||
              backgroundColor,
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <ListItem.Content>
          <ListItem.Title>{title}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Content right>
          <ListItem.Title right style={{ fontSize: 15 }}>
            {(Array.isArray(rightTitle) &&
              rightTitle[Number(switched[stateIndex])]) ||
              rightTitle}
          </ListItem.Title>
        </ListItem.Content>
        {!hideChevron && <ListItem.Chevron />}
        {checkBox && (
          <Switch
            value={switched[stateIndex]}
            onValueChange={(val) => {
              setSwitched[stateIndex](val);
              CheckBoxes[stateIndex].onPress(props0, val);
            }}
          />
        )}
      </ListItem>
    );
  };

  const renderSectionHeader = () => <View style={styles.headerSection} />;

  const ItemSeparatorComponent = () => (
    <View style={[styles.separatorComponentLight]}>
      <Divider style={styles.separator} />
    </View>
  );

  const keyExtractor = (item, index) => {
    return index.toString();
  };

  const CustomModal = () => {
    let setModalVisible = setSwitched[NOTIFICATION_BUTTON];
    let val = switched[NOTIFICATION_BUTTON];
    const InputFieldsStyle = {
      borderWidth: 0,
    };
    let [text, setText] = useState("");
    return (
      <View style={styles.centeredView}>
        <Modal animationType="fade" transparent={true} visible={val}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Input
                onChangeText={setText}
                rightIcon={
                  <Button
                    icon={
                      <Icon
                        name="check"
                        type="entypo"
                        color="#fafafa"
                        size={25}
                      />
                    }
                    buttonStyle={{
                      backgroundColor: "black",
                      borderWidth: 1,
                      borderColor: "white",
                      borderRadius: 20,
                    }}
                    onPress={() => {
                      let inputNum = Number(text);
                      if (!inputNum) {
                        inputNum = 0;
                      }
                      setModalVisible(!val);
                      onSubmit(inputNum);
                    }}
                  />
                }
                containerStyle={styles.inputContainerStyle}
                placeholder="secs to trigger"
                style={InputFieldsStyle}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <>
      <SectionList
        keyExtractor={keyExtractor}
        // ListHeaderComponent={ListHeaderComponent}
        sections={sections.filter(
          (s) => !(s.debugOnly && !switched[DEBUG_MODE_BOX])
        )}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={ItemSeparatorComponent}
        stickySectionHeadersEnabled={false}
      />
      <CustomModal />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EFEFF4",
  },
  separatorComponentLight: {
    marginRight: ITEM_MARGIN,
    marginLeft: ITEM_MARGIN,
    backgroundColor: "white",
  },
  separatorComponentDark: {
    backgroundColor: "black",
  },
  separator: {
    marginLeft: 58,
  },
  headerSection: {
    height: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 250,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  // buttonClose: {
  //   backgroundColor: "#2196F3",
  // },
  inputContainerStyle: {
    marginTop: 16,
    width: "90%",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    // padding: 10,
    width: 60,
  },
});

export default SettingsPage;
