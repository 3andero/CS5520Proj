import * as Notifications from "expo-notifications";
import { CALLBACK_MGR } from "./utils/CallbackMgr";
import {
  appendPlaceToDate,
  currDate,
  getEpiCenter,
  storeEpiCenter,
} from "./utils/PlacesStorage";

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

export const onSubmit = (sec, zip) => {
  requestNotificationPermission().then(() => {
    notify(sec, zip);
  });
};

const notify = (sec, zip) => {
  if (!sec) {
    sec = 0;
  }
  if (sec <= 0) {
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      },
    });
  }
  const schedulingOptions = {
    content: {
      title: "Possible Exposure Detected",
      body: "please take a look",
      sound: true,
      color: "blue",
      data: { data: [zip] },
    },
    trigger:
      sec <= 0
        ? null
        : {
            seconds: sec,
          },
  };

  Notifications.scheduleNotificationAsync(schedulingOptions);

  Notifications.addNotificationReceivedListener((n) => {
    // console.log("This is run")
    getEpiCenter().then((val) => {
      let {
        request: {
          content: {
            data: { data: arr },
          },
        },
      } = n;
      if (!isObject(val)) {
        val = {};
      }
      appendPlaceToDate(val, currDate(), arr);
      storeEpiCenter(val).then((_val) => CALLBACK_MGR.reloadCallback());
    });
  });
};

const isObject = (obj) =>
  (typeof obj === "object" || typeof obj === "function") && obj !== null;
