import { apiGet, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchServices = createAsyncThunk(
  "services/fetch",
  async (token: string) => {
    const response = await apiGet<ServicesResponse>(urls.services.list, token);
    return response.data;
  }
);

export const fetchServiceStatus = createAsyncThunk(
  "servicesStatusList/fetch",
  async (token: string) => {
    const response = await apiGet<ServiceStatusResponse>(
      urls.services.statusList,
      token
    );
    return response.data;
  }
);
