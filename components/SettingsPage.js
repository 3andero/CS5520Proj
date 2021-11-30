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

import * as VaccineCard from "./VaccineCardPage";
import * as IDCard from "./IDCardPage";
import { onSubmit } from "./NotificationMgr";
import { removeValue, storeData } from "./utils/Storage";
import {
  currDate,
  getEpiCenter,
  getVisited,
  storeEpiCenter,
  storeVisited,
} from "./utils/PlacesStorage";
import { CALLBACK_MGR } from "./utils/CallbackMgr";

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

const resetCards = (msg) => {
  Alert.alert("Warning", msg, [
    { text: "Cancel", onPress: () => {}, style: "cancel" },
    {
      text: "Yes",
      onPress: () => {
        [VaccineCard.Key, IDCard.Key].map((val) => removeValue(val));
      },
      style: "default",
    },
  ]);
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
        onPress: () =>
          resetCards("Do you want to reset your vaccine card and ID?"),
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
        backgroundColor: ORANGE,
        hideChevron: true,
        type: "materialIcons",
        stateIndex: NOTIFICATION_BUTTON,
      },
      {
        title: "Load Default Record",
        icon: "upload",
        backgroundColor: GREEN,
        hideChevron: true,
        type: "foundation",
        onPress: () => {
          let visited = {
            [currDate()]: ["V5H0H2", "V5H0H1", "V3H1J2", "V3H0H2"],
          };
          storeVisited(visited);
          storeEpiCenter({});
          CALLBACK_MGR.reloadCallback();
        },
      },
      {
        title: "Load Exposed Record",
        icon: "upload",
        backgroundColor: PURPLE,
        hideChevron: true,
        type: "foundation",
        onPress: () => {
          let visited = {
            [currDate()]: ["V5H0H2", "V5H0H1", "V3H1J2", "V3H0H2"],
          };
          let epiCenter = {
            [currDate()]: ["V3H0H2", "V3H2T7"],
          };
          storeVisited(visited);
          storeEpiCenter(epiCenter);
          CALLBACK_MGR.reloadCallback();
        },
      },
      {
        title: "Full Reset",
        backgroundColor: RED,
        icon: "reload-circle",
        type: "ionicon",
        onPress: () => {
          resetCards(
            "Do you want to reset Vaccine Card, ID and all exposure data?"
          );
          storeVisited({});
          storeEpiCenter({});
          CALLBACK_MGR.reloadCallback();
        },
      },
      {
        title: "Show Places",
        backgroundColor: TEAL_BLUE,
        icon: "magnifying-glass",
        type: "foundation",
        onPress: () => {
          let e = "";
          let v = "";

          (async () => {
            await getEpiCenter().then((val) => {
              e = val;
              console.log(val);
            });
            await getVisited().then((val) => {
              v = val;
              console.log(val);
            });
          })().then(() =>
            Alert.alert(
              "Info",
              "EpiCenter " +
                JSON.stringify(e) +
                "\nVisited " +
                JSON.stringify(v)
            )
          );
        },
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

  const ModalWrapper = () =>
    CustomModal(
      switched[NOTIFICATION_BUTTON],
      setSwitched[NOTIFICATION_BUTTON]
    );

  return (
    <>
      <SectionList
        keyExtractor={keyExtractor}
        sections={sections.filter(
          (s) => !(s.debugOnly && !switched[DEBUG_MODE_BOX])
        )}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={ItemSeparatorComponent}
        stickySectionHeadersEnabled={false}
      />
      <ModalWrapper />
    </>
  );
};

const CustomModal = (val, setModalVisible) => {
  const InputFieldsStyle = {
    borderWidth: 0,
  };
  let [sec, setSec] = useState("");
  let [zip, setZip] = useState("");
  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={val}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Input
              onChangeText={setSec}
              containerStyle={styles.inputContainerStyle}
              placeholder="seconds to trigger"
              style={InputFieldsStyle}
            />
            <Input
              onChangeText={setZip}
              containerStyle={{ ...styles.inputContainerStyle, marginTop: 0 }}
              placeholder="Postal Code"
              style={InputFieldsStyle}
            />
            <Button
              icon={
                <Icon name="check" type="entypo" color="#fafafa" size={25} />
              }
              buttonStyle={{
                backgroundColor: "black",
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 25,
              }}
              onPress={() => {
                let inputNum = Number(sec);
                if (!inputNum) {
                  inputNum = 0;
                }
                setModalVisible(!val);
                onSubmit(inputNum, zip);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
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
