/* eslint-disable camelcase */
import { apiDelete, apiGet, apiPost, urls } from "@api";

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
  const response = await apiDelete<DeleteDriverResponse>(
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

export const addDriverBehavior = async (
  token: string,
  body: AddDriverBehaviorRequest
): Promise<AddDriverBehaviorResponse> => {
  const response = await apiPost<
    AddDriverBehaviorResponse,
    AddDriverBehaviorRequest
  >(urls.driver.addBehavior, token, body);
  return response.data;
};

export const getDriverBehaviorByDriverId = async (
  token: string,
  driverId: string
): Promise<DriverBehaviorResponse> => {
  const response = await apiGet<DriverBehaviorResponse>(
    urls.driver.getBehaviorByDriverId(driverId),
    token
  );
  return response.data;
};

export const getBehaviorEventTypes = async (
  token: string
): Promise<DriverBehaviorEventType> => {
  const response = await apiGet<DriverBehaviorEventType>(
    urls.driver.getBehaviorEventType,
    token
  );
  return response.data;
};

export const qrScanDeviceDetails = async (
  token: string,
  imei: string
): Promise<QRScanDeviceDetailsResponse> => {
  console.log("api called");
  const response = await apiGet<QRScanDeviceDetailsResponse>(
    urls.driver.qrScan(imei),
    token
  );
  return response.data;
};

export const getCheckList = async (
  token: string
): Promise<ChecklistListResponse> => {
  const response = await apiGet<ChecklistListResponse>(
    urls.driver.getCheckList,
    token
  );
  return response.data;
};

export const addChecklistItem = async (
  token: string,
  body: AddChecklistItemRequest
): Promise<ChecklistRecordResponse> => {
  const response = await apiPost<
    ChecklistRecordResponse,
    AddChecklistItemRequest
  >(urls.driver.addChecklistItem, token, body);
  return response.data;
};

export const updateChecklistItem = async (
  token: string,
  body: UpdateChecklistItemRequest
): Promise<ChecklistRecordResponse> => {
  const response = await apiPost<
    ChecklistRecordResponse,
    UpdateChecklistItemRequest
  >(urls.driver.updateChecklistItem, token, body);
  return response.data;
};

export const deleteChecklistItem = async (
  token: string,
  checklistItemId: number
): Promise<ChecklistRecordResponse> => {
  const response = await apiDelete<ChecklistRecordResponse>(
    urls.driver.deleteChecklistItem(checklistItemId),
    token
  );
  return response.data;
};

export const availableStatusToggle = async (token: string, value: 0 | 1) => {
  const response = await apiPost<MessageResponse, { available_status: 0 | 1 }>(
    urls.driver.availableStatusToggle,
    token,
    { available_status: value }
  );
  return response.data;
};

export const addTask = async (
  token: string,
  body: AddNewTaskRequest
): Promise<AddNewTaskResponse> => {
  const response = await apiPost<AddNewTaskResponse, AddNewTaskRequest>(
    urls.driver.addNewTask,
    token,
    body
  );
  return response.data;
};

export const endTask = async (
  token: string,
  body: EndTaskRequest
): Promise<EndTaskResponse> => {
  const response = await apiPost<EndTaskResponse, EndTaskRequest>(
    urls.driver.endTask,
    token,
    body
  );
  return response.data;
};

export const getTaskList = async (
  token: string
): Promise<GetTaskListResponse> => {
  const response = await apiGet<GetTaskListResponse>(
    urls.driver.getTaskList,
    token
  );
  return response.data;
};

export const addDriverWorkingTime = async (
  token: string,
  body: AddWorkingTimeRequest
) => {
  const response = await apiPost<AddWorkingTimeResponse, AddWorkingTimeRequest>(
    urls.driver.addDriverWorkingTime,
    token,
    body
  );
  return response.data;
};
