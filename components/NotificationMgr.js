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
  if (!CALLBACK_MGR.alertStatus()) {
    return;
  }

  if (!sec) {
    sec = 0;
  }

  const updateEpiCenter = async (arr) => {
    let val = await getEpiCenter();
    if (!isObject(val)) {
      val = {};
    }
    appendPlaceToDate(val, currDate(), arr);
    storeEpiCenter(val).then((_val) => CALLBACK_MGR.reloadCallback());
    console.log("notification callback");
  };

  Notifications.setNotificationHandler({
    handleNotification: async (n) => {
      let {
        request: {
          content: {
            data: { data: arr },
          },
        },
      } = n;
      await updateEpiCenter(arr);
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    },
  });

  if (sec > 0) {
    updateEpiCenter([zip]);
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
};

const isObject = (obj) =>
  (typeof obj === "object" || typeof obj === "function") && obj !== null;
