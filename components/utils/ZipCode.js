import * as Location from "expo-location";
import { Alert } from "react-native";
import {
  appendPlaceToDate,
  currDate,
  getVisited,
  storeVisited,
} from "./PlacesStorage";

/**
 * usage:
 * `getZipCode(-122.9725459, 49.2433804).then(val => console.log(val));`
 *
 * sample output:
 *
 * "V5G 1M1"
 *
 * @param {*} longitude
 * @param {*} latitude
 * @returns postal code
 */
export async function getZipCode(longitude, latitude) {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Error", "Permission to access location was denied");
    return;
  }

  let regions = await Location.reverseGeocodeAsync({
    longitude,
    latitude,
  });

  return regions.pop().postalCode;
}

/**
 * usage:
 * `getLocation("V5G 1M1").then(val => console.log(val));`
 *
 * sample output:
 * Object {
 *  "accuracy": 100,
 *  "altitude": 0,
 *  "latitude": 49.2452498,
 *  "longitude": -122.9754051,
 *},
 *
 * @param {*} postalCode
 * @returns
 */
export async function getLocation(postalCode) {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Error", "Permission to access location was denied");
    return;
  }
  let regions = await Location.geocodeAsync(postalCode);
  return regions.pop();
}

/**
 * usage:
 * `getDetailedLocation("V5G 1M1").then(val => console.log(val));`
 *
 * Sample output:
 * Object {
 *  "city": "Burnaby",
 *  "country": "Canada",
 *  "district": "Deer Lake",
 *  "isoCountryCode": "CA",
 *  "name": "4925 Canada Way",
 *  "postalCode": "V5G 1M1",
 *  "region": "BC",
 *  "street": "Canada Way",
 *  "subregion": "Metro Vancouver",
 *  "timezone": "America/Vancouver",
 * }
 * @param {*} postalCode
 * @returns detailed information
 */
export async function getDetailedLocation(postalCode) {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Error", "Permission to access location was denied");
    return;
  }
  let loc = await getLocation(postalCode);
  if (!loc) {
    return [postalCode, loc];
  }
  let regions = await Location.reverseGeocodeAsync({
    longitude: loc.longitude,
    latitude: loc.latitude,
  });

  return [regions.pop(), loc];
}

export const extractSummary = (details) =>
  (!details.name && details) ||
  details.name +
    ", " +
    ((Platform.OS === "android" && details.street + ", ") || "") +
    details.region;

export const getCurrentLocationAndStore = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log(status);
    return [false, null];
  }
  let position = await Location.getCurrentPositionAsync({});

  if (!position || !position.coords) {
    return [false, null];
  }

  let coordinate = {
    longitude: position.coords.longitude,
    latitude: position.coords.latitude,
  };

  let places = await getVisited();
  let date = currDate();
  let postcode = await getZipCode(coordinate.longitude, coordinate.latitude);
  appendPlaceToDate(places, date, [postcode]);
  storeVisited(places);
  return [true, coordinate];
};
