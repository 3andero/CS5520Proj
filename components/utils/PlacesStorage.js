import { getData, storeData } from "./Storage";

export const Key = "@places";
export const visited = "Visited";
export const epiCenter = "EpiCenter";

export const getVisited = () => getPlaces(visited);
export const getEpiCenter = () => getPlaces(epiCenter);

export const storeVisited = (val) => saveActivity(val, visited);
export const storeEpiCenter = (val) => saveActivity(val, epiCenter);

const getPlaces = (placeType) =>
  getData(Key + placeType).then((val) => (val && JSON.parse(val)) || {});
const saveActivity = (val, placeType) => {
  storeData(Key + placeType, JSON.stringify(val));
};

export const currDate = () => new Date().toISOString().slice(0, 10);
export const appendPlaceToDate = (place, date) => {
  if (date in place) {
    place[date].push(place);
  } else {
    place[date] = [place];
  }
};

export const intersection = (p1, p2) => {
  res = [];
  for (const [k, v] of Object.entries(p2)) {
    if (!(k in p1)) {
      continue;
    }
    let sv = new Set(v);
    res.push(...p1[k].filter((v) => sv.has(v)));
  }
  return res;
};
