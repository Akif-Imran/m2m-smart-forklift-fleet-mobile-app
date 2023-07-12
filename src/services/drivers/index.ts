import { apiGet, apiPost, urls } from "@api";

export const getDrivers = async (token: string): Promise<DriversResponse> => {
  const response = await apiGet<DriversResponse>(urls.driver.list, token);
  return response.data;
};

export const getDriverById = async (
  token: string,
  driverId: string
): Promise<DriverResponse> => {
  const response = await apiGet<DriverResponse>(
    urls.driver.getById(driverId),
    token
  );
  return response.data;
};

export const deleteDriver = async (
  token: string,
  driverId: string
): Promise<DeleteDriverResponse> => {
  const response = await apiGet<DeleteDriverResponse>(
    urls.driver.delete(driverId),
    token
  );
  return response.data;
};

export const updateDriver = async (
  token: string,
  body: UpdateDriverRequest
): Promise<UpdateDriverResponse> => {
  const response = await apiPost<UpdateDriverResponse, UpdateDriverRequest>(
    urls.driver.update,
    token,
    body
  );
  return response.data;
};

export const addDriver = async (
  token: string,
  body: AddDriverRequest
): Promise<AddDriverResponse> => {
  const response = await apiPost<AddDriverResponse, AddDriverRequest>(
    urls.driver.create,
    token,
    body
  );
  return response.data;
};

export const assignVehicles = async (
  token: string,
  body: AssignVehicleRequest
): Promise<AssignVehicleResponse> => {
  const response = await apiPost<AssignVehicleResponse, AssignVehicleRequest>(
    urls.driver.assignVehicles,
    token,
    body
  );
  return response.data;
};

export const getAssignedVehicles = async (token: string, driverId: string) => {
  const response = await apiGet<GetAssignedVehicleResponse>(
    urls.driver.getAssignedVehicles(driverId),
    token
  );
  return response.data;
};
