import { apiGet, urls } from "@api";

export const getDevicesList = async (
  token: string
): Promise<DevicesListResponse> => {
  const response = await apiGet<DevicesListResponse>(urls.devices.list, token);
  return response.data;
};

export const getVehicleList = async (
  token: string
): Promise<VehicleListResponse> => {
  const response = await apiGet<VehicleListResponse>(urls.vehicles.list, token);
  return response.data;
};
