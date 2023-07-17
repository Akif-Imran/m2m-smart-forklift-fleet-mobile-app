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

export const getNotificationsList = async (token: string) => {
  const response = await apiGet<NotificationListResponse>(
    urls.notifications.list,
    token
  );
  return response.data;
};

export const createGeoFence = async (
  token: string,
  body: AddGeoFenceRequest
): Promise<AddGeoFenceResponse> => {
  const response = await apiPost<AddGeoFenceResponse, AddGeoFenceRequest>(
    urls.geoFence.create,
    token,
    body
  );
  return response.data;
};

export const updateGeoFence = async (
  token: string,
  body: UpdateGeoFenceRequest
): Promise<UpdateGeoFenceResponse> => {
  const response = await apiPost<UpdateGeoFenceResponse, UpdateGeoFenceRequest>(
    urls.geoFence.update,
    token,
    body
  );
  return response.data;
};

export const deleteGeoFence = async (
  token: string,
  geoFenceId: string
): Promise<DeleteGeoFenceResponse> => {
  const response = await apiDelete<DeleteGeoFenceResponse>(
    urls.geoFence.delete(geoFenceId),
    token
  );
  return response.data;
};

export const getGeoFenceList = async (
  token: string
): Promise<GeoFenceListResponse> => {
  const response = await apiGet<GeoFenceListResponse>(
    urls.geoFence.list,
    token
  );
  return response.data;
};

export const getGeoFenceById = async (
  token: string,
  geoFenceId: string
): Promise<GeoFenceByIdResponse> => {
  const response = await apiGet<GeoFenceByIdResponse>(
    urls.geoFence.getById(geoFenceId),
    token
  );
  return response.data;
};

export const getGeoFenceByDeviceId = async (
  token: string,
  deviceId: string
): Promise<GeoFenceListResponse> => {
  const response = await apiGet<GeoFenceListResponse>(
    urls.geoFence.getByDeviceId(deviceId),
    token
  );
  return response.data;
};
