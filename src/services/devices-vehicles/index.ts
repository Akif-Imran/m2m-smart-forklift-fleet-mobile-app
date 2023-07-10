import { apiGet, urls } from "@api";

export const getDevicesList = async (
  token: string
): Promise<DevicesListResponseType> => {
  const response = await apiGet<DevicesListResponseType>(
    urls.devices.list,
    token
  );
  return response.data;
};

export const getVehicleList = async (
  token: string
): Promise<DevicesListResponseType> => {
  const response = await apiGet<DevicesListResponseType>(
    urls.devices.list,
    token
  );
  return response.data;
};
