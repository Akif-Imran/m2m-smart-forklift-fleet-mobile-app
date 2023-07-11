import { apiGet, apiPost, urls } from "@api";

export const getServiceCounts = async (
  token: string
): Promise<ServiceCountsResponse> => {
  const response = await apiGet<ServiceCountsResponse>(
    urls.services.counts,
    token
  );
  return response.data;
};

export const getServiceTypes = async (
  token: string
): Promise<ServiceTypesResponse> => {
  const response = await apiGet<ServiceTypesResponse>(
    urls.services.typeList,
    token
  );
  return response.data;
};

export const getServices = async (token: string): Promise<ServicesResponse> => {
  const response = await apiGet<ServicesResponse>(urls.services.list, token);
  return response.data;
};

export const addService = async (
  token: string,
  body: AddServiceRequest
): Promise<AddServiceResponse> => {
  const response = await apiPost<AddServiceResponse, AddServiceRequest>(
    urls.services.create,
    token,
    body
  );
  return response.data;
};

export const getServiceStatus = async (
  token: string
): Promise<ServiceStatusResponse> => {
  const response = await apiGet<ServiceStatusResponse>(
    urls.services.statusList,
    token
  );
  return response.data;
};

export const updateServiceStatus = async (
  token: string,
  body: UpdateServiceStatusRequest
) => {
  const response = await apiPost<
    UpdateServiceStatusResponse,
    UpdateServiceStatusRequest
  >(urls.services.updateStatus, token, body);
  return response.data;
};

export const deleteService = async (token: string, serviceId: number) => {
  const response = await apiGet(
    urls.services.delete(serviceId.toString()),
    token
  );
  return response.data;
};
