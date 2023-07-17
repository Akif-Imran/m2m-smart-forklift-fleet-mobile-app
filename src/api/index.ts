import { Platform } from "react-native";
import appConfig from "@app-config";
import type { AxiosResponse } from "axios";
import axios from "axios";

export const baseURL = "http://www.sealtracking.com:4600";
export const BASE_USER_URL = `${baseURL}/user`;
export const BASE_DEVICE_URL = `${baseURL}/device`;
export const BASE_VEHICLE_URL = `${baseURL}/vehicle`;
export const BASE_GEO_FENCE_URL = `${baseURL}/geofence`;
export const BASE_SERVICE_URL = `${baseURL}/service`;
export const BASE_DRIVER_URL = `${baseURL}/driver`;
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
  user: {
    changePassword: `${BASE_USER_URL}/resetPassword`,
    deleteAccount: `${BASE_USER_URL}/deleteAccount`,
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
    getFuelTypes: `${BASE_VEHICLE_URL}/getFuelTypes`,
  },
  geoFence: {
    create: `${BASE_GEO_FENCE_URL}/create`,
    update: `${BASE_GEO_FENCE_URL}/update`,
    list: `${BASE_GEO_FENCE_URL}/getall`,
    getById: (geoFenceId: string) =>
      `${BASE_GEO_FENCE_URL}/getById?id=${geoFenceId}`,
    getByDeviceId: (deviceId: string) =>
      `${BASE_GEO_FENCE_URL}/getAllByDeviceId?device_id=${deviceId}`,
    delete: (geoFenceId: string) =>
      `${BASE_GEO_FENCE_URL}/delete?id=${geoFenceId}`,
  },
  services: {
    counts: `${BASE_SERVICE_URL}/statusCount`,
    list: `${BASE_SERVICE_URL}/getAll`,
    getById: (serviceId: string) =>
      `${BASE_SERVICE_URL}/getServiceById?id=${serviceId}`,
    typeList: `${BASE_SERVICE_URL}/getServiceTypes`,
    statusList: `${BASE_SERVICE_URL}/getAllStatus`,
    updateStatus: `${BASE_SERVICE_URL}/updateStatus`,
    create: `${BASE_SERVICE_URL}/create`,
    delete: (serviceId: string) => `${BASE_SERVICE_URL}/delete?id=${serviceId}`,
  },
  driver: {
    list: `${BASE_DRIVER_URL}/getAll`,
    create: `${BASE_DRIVER_URL}/create`,
    update: `${BASE_DRIVER_URL}/update`,
    assignVehicles: `${BASE_DRIVER_URL}/assignDriver`, //this assigns multiple vehicles to a driver
    getById: (driverId: string) =>
      `${BASE_DRIVER_URL}/getDriverById?id=${driverId}`,
    delete: (driverId: string) => `${BASE_DRIVER_URL}/delete?id=${driverId}`,
    getAssignedVehicles: (driverId: string) =>
      `${BASE_DRIVER_URL}/getAssignedVehiclesByDriverId?driver_id=${driverId}`,
    getBehaviorEventType: `${BASE_DRIVER_URL}/getEventType`,
    addBehavior: `${BASE_DRIVER_URL}/addDriverBehavior`,
    getBehaviorByDriverId: (driverId: string) =>
      `${BASE_DRIVER_URL}/getDriverBehavior?driver_id=${driverId}`,
    addDriverWorkingTime: `${BASE_DRIVER_URL}/addDriverWorkingTime`,
    qrScan: (imei: string) => `${baseURL}/user_device_details/${imei}`,
    getCheckList: `${baseURL}/get_checklist`,
    getTaskList: `${baseURL}/get_task_list/1`,
    addNewTask: `${baseURL}/add_new_task`,
    endTask: `${baseURL}/end_task`,
  },
  poi: {
    list: `${BASE_POI_URL}/getAll`,
    create: `${BASE_POI_URL}/create`,
    update: `${BASE_POI_URL}/update`,
    delete: (poiId: string) => `${BASE_POI_URL}/delete/${poiId}`,
  },
  notifications: {
    list: `${baseURL}/notifications`,
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
