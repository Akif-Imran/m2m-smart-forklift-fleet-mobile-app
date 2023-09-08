import { apiGet, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchVehicles = createAsyncThunk(
  "vehicles/fetch",
  async (token: string) => {
    const response = await apiGet<VehicleListResponse>(
      urls.vehicles.list,
      token
    );
    return response.data;
  }
);
