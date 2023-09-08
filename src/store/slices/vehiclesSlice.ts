import type { PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { fetchVehicles } from "@thunks";

interface State {
  data: ListResponse<IVehicle[]>;
  isLoading: boolean;
  error: null | SerializedError;
}
const initialState: State = {
  data: { count: 0, rows: [] },
  isLoading: false,
  error: null,
};
const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState: initialState,
  reducers: {
    updateVehicleIcon: (state, action: PayloadAction<IUpdateIconPayload>) => {
      const index = state.data.rows.findIndex(
        (vehicle) => vehicle.id === action.payload.id
      );
      state.data.rows[index].icon = action.payload.icon;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVehicles.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchVehicles.fulfilled, (state, action) => {
      state.data = action.payload.success ? action.payload.data : state.data;
      state.error = null;
      state.isLoading = false;
    });
    builder.addCase(fetchVehicles.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
  },
});

export { vehiclesSlice };
export const { updateVehicleIcon } = vehiclesSlice.actions;
export const vehiclesReducer = vehiclesSlice.reducer;

interface IUpdateIconPayload {
  id: number;
  icon: string;
}
