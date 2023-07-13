import { apiDelete, apiGet, apiPost, urls } from "@api";

export const getDevicesList = async (
  token: string
): Promise<DevicesListResponse> => {
  const response = await apiGet<DevicesListResponse>(urls.devices.list, token);
  return response.data;
};

export const addDevice = async (
  token: string,
  body: AddDeviceRequest
): Promise<AddDeviceResponse> => {
  const response = await apiPost<AddDeviceResponse, AddDeviceRequest>(
    urls.devices.create,
    token,
    body
  );
  return response.data;
};
export const getFuelTypes = async (
  token: string
): Promise<FuelTypeListResponse> => {
  const response = await apiGet<FuelTypeListResponse>(
    urls.vehicles.getFuelTypes,
    token
  );
  return response.data;
};

export const getVehicleList = async (
  token: string
): Promise<VehicleListResponse> => {
  const response = await apiGet<VehicleListResponse>(urls.vehicles.list, token);
  return response.data;
};

export const getVehicleById = async (
  token: string,
  vehicleId: string
): Promise<VehicleByIdResponse> => {
  const response = await apiGet<VehicleByIdResponse>(
    urls.vehicles.getById(vehicleId),
    token
  );
  return response.data;
};

export const deleteVehicle = async (
  token: string,
  vehicleId: string
): Promise<DeleteVehicleResponse> => {
  const response = await apiDelete<DeleteVehicleResponse>(
    urls.vehicles.delete(vehicleId),
    token
  );
  return response.data;
};

export const addVehicle = async (
  token: string,
  body: AddVehicleRequest
): Promise<AddVehicleResponse> => {
  const response = await apiPost<AddVehicleResponse, AddVehicleRequest>(
    urls.vehicles.create,
    token,
    body
  );
  return response.data;
};

export const updateVehicle = async (
  token: string,
  body: UpdateVehicleRequest
): Promise<UpdateVehicleResponse> => {
  const response = await apiPost<UpdateVehicleResponse, UpdateVehicleRequest>(
    urls.vehicles.update,
    token,
    body
  );
  return response.data;
};

export const getPoiList = async (token: string): Promise<PoiListResponse> => {
  const response = await apiGet<PoiListResponse>(urls.poi.list, token);
  return response.data;
};

export const deletePoi = async (
  token: string,
  poiId: string
): Promise<DeletePoiResponse> => {
  const response = await apiDelete<DeletePoiResponse>(
    urls.poi.delete(poiId),
    token
  );
  return response.data;
};

export const addPoi = async (
  token: string,
  body: AddPOIRequest
): Promise<AddPOIResponse> => {
  const response = await apiPost<AddPOIResponse, AddPOIRequest>(
    urls.poi.create,
    token,
    body
  );
  return response.data;
};

export const updatePoi = async (
  token: string,
  body: UpdatePOIRequest
): Promise<UpdatePOIResponse> => {
  const response = await apiPost<UpdatePOIResponse, UpdatePOIRequest>(
    urls.poi.update,
    token,
    body
  );
  return response.data;
};
