const settings = {
  100: {
    fontFamily: "sans-serif-thin",
    fontWeight: "normal",
  },
  200: {
    fontFamily: "sans-serif-thin",
    fontWeight: "normal",
  },
  300: {
    fontFamily: "sans-serif-light",
    fontWeight: "normal",
  },
  400: {
    fontFamily: "sans-serif-light",
    fontWeight: "normal",
  },
  500: {
    fontFamily: "sans-serif",
    fontWeight: "normal",
  },
  600: {
    fontFamily: "sans-serif-medium",
    fontWeight: "normal",
  },
  700: {
    fontFamily: "sans-serif",
    fontWeight: "bold",
  },
  800: {
    fontFamily: "sans-serif-medium",
    fontWeight: "bold",
  },
  900: {
    fontFamily: "sans-serif-medium",
    fontWeight: "bold",
  },
};

export function fontWeight(weight) {
  if (Platform.OS === "android") {
    return settings[weight.toString()];
  }
  return {
    fontWeight: weight.toString(),
  };
}
