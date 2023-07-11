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
  dashboard: {
    counts: `${baseURL}/app_dashboard`,
  },
  devices: {
    list: `${baseURL}/device_list`,
  },
  vehicles: {
    list: `${baseURL}/vehicle_list`,
  },
  services: {
    counts: `${baseURL}/services_status_count`,
    list: `${baseURL}/get_services`,
    typeList: `${baseURL}/get_service_types`,
    statusList: `${baseURL}/get_all_status`,
    updateStatus: `${baseURL}/update_service`,
    create: `${baseURL}/add_service`,
    delete: (serviceId: string) => `${baseURL}/delete_service/${serviceId}`,
  },
  driver: {
    list: `${baseURL}/get_driver_list`,
    getById: (driverId: string) => `${baseURL}/get_driver/${driverId}`,
    create: `${baseURL}/add_new_driver`,
    update: `${baseURL}/update_driver`,
    delete: (driverId: string) => `${baseURL}/delete_driver/${driverId}`,
  },
};

export const apiGet = async <R>(
  url: string,
  token: string
): Promise<AxiosResponse<R>> => {
  const response = await axios.get<R>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const apiPost = async <R, P>(
  url: string,
  token: string,
  body: P
): Promise<AxiosResponse<R>> => {
  const response = await axios.post<R>(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
