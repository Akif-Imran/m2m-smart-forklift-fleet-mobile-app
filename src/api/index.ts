import { Platform } from "react-native";
import appConfig from "@app-config";
import type { AxiosResponse } from "axios";
import axios from "axios";

export const baseURL = "http://www.sealtracking.com:4600";
export const GOOGLE_MAPS_API = "https://maps.googleapis.com/maps/api";
export const GOOGLE_PLACES_API = `${GOOGLE_MAPS_API}/place`;
export const GOOGLE_DIRECTIONS_API = `${GOOGLE_MAPS_API}/directions/json`;
export const GOOGLE_GEOCODING_API = `${GOOGLE_MAPS_API}/geocode/json`;
export const GOOGLE_API_KEY =
  Platform.OS === "android"
    ? appConfig.expo.android.config.googleMaps.apiKey
    : appConfig.expo.ios.config.googleMapsApiKey;

export const urls = {
  auth: {
    login: `${baseURL}/login`,
  },
};

export const apiPost = async <R, P>(
  url: string,
  body: P
): Promise<AxiosResponse<R>> => {
  const response = await axios.post<R>(url, body);
  return response;
};
