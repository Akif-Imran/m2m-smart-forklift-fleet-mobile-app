import type { SerializedError } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { fetchServiceStatus } from "@thunks";

interface State {
  data: IServiceStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};
const serviceStatusSlice = createSlice({
  name: "serviceStatusList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchServiceStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchServiceStatus.fulfilled, (state, action) => {
      state.data = action.payload.success ? action.payload.data : state.data;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(fetchServiceStatus.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
  },
});

export { serviceStatusSlice };
// export const {} = serviceStatusSlice.actions;
export const serviceStatusReducer = serviceStatusSlice.reducer;
