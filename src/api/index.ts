import { Platform } from "react-native";
import appConfig from "@app-config";
import type { AxiosResponse } from "axios";
import axios from "axios";

export const baseURL = "http://www.sealtracking.com:4600";
export const baseDeviceURL = `${baseURL}/device`;
export const baseVehicleURL = `${baseURL}/vehicle`;
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
    list: `${baseDeviceURL}/getAll`,
    getDeviceDetails: (imei: string) =>
      `${baseDeviceURL}/getDeviceDetail?IMEI=${imei}`,
    create: `${baseDeviceURL}/create`,
    createMany: `${baseDeviceURL}/createMultiple`,
    update: `${baseDeviceURL}/update`,
  },
  vehicles: {
    list: `${baseVehicleURL}/getAll`,
    getById: (vehicleId: string) =>
      `${baseVehicleURL}/getVehicleById?id=${vehicleId}`,
    create: `${baseVehicleURL}/create`,
    update: `${baseVehicleURL}/update`,
    delete: (vehicleId: string) => `${baseVehicleURL}/delete?id=${vehicleId}`,
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
