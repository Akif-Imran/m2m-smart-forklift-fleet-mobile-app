import type { SerializedError } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { fetchServices } from "@thunks";

interface State {
  data: ListResponse<IService[]>;
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: { count: 0, rows: [] },
  isLoading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "services",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchServices.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload.success ? action.payload.data : state.data;
      state.error = null;
    });
    builder.addCase(fetchServices.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
  },
});

export { serviceSlice };
// export const {} = serviceSlice.actions;
export const serviceReducer = serviceSlice.reducer;
