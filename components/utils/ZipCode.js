import Constants from 'expo-constants';
import * as Location from 'expo-location';

let apiKey = 'AIzaSyA937CZdWjwqTPx91Zw2hD3Ik8VnWAQ9gc';

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
    Location.setGoogleApiKey(apiKey);
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
    Location.setGoogleApiKey(apiKey);
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
    let loc = await getLocation(postalCode);
    let regions = await Location.reverseGeocodeAsync({
        longitude: loc.longitude,
        latitude: loc.latitude,
    });

    return regions.pop();
}