import * as Notifications from "expo-notifications";

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

export const onSubmit = (val) => {
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
          shouldPlaySound: true,
          shouldSetBadge: true,
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
};
