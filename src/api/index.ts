import { Platform } from "react-native";
import appConfig from "@app-config";
import type { AxiosResponse } from "axios";
import axios from "axios";

export const baseURL = "http://www.sealtracking.com:4600";
export const BASE_DEVICE_URL = `${baseURL}/device`;
export const BASE_VEHICLE_URL = `${baseURL}/vehicle`;
export const BASE_POI_URL = `${baseURL}/poi`;
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
    list: `${BASE_DEVICE_URL}/getAll`,
    getDeviceDetails: (imei: string) =>
      `${BASE_DEVICE_URL}/getDeviceDetail?IMEI=${imei}`,
    create: `${BASE_DEVICE_URL}/create`,
    createMany: `${BASE_DEVICE_URL}/createMultiple`,
    update: `${BASE_DEVICE_URL}/update`,
  },
  vehicles: {
    list: `${BASE_VEHICLE_URL}/getAll`,
    getById: (vehicleId: string) =>
      `${BASE_VEHICLE_URL}/getVehicleById?id=${vehicleId}`,
    create: `${BASE_VEHICLE_URL}/create`,
    update: `${BASE_VEHICLE_URL}/update`,
    delete: (vehicleId: string) => `${BASE_VEHICLE_URL}/delete?id=${vehicleId}`,
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
    assignVehicles: `${baseURL}/assign_driver`, //this assigns multiple vehicles to a driver
    getAssignedVehicles: (driverId: string) =>
      `${baseURL}/get_assigned_vehicle/${driverId}`,
  },
  poi: {
    list: `${BASE_POI_URL}/getAll`,
    create: `${BASE_POI_URL}/create`,
    update: `${BASE_POI_URL}/update`,
    delete: (poiId: string) => `${BASE_POI_URL}/delete/${poiId}`,
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

export const apiDelete = async <R>(
  url: string,
  token: string
): Promise<AxiosResponse<R>> => {
  const response = await axios.delete<R>(url, {
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
