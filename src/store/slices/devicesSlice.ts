/* eslint-disable camelcase */
import type { PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { fetchDevices } from "@thunks";

interface State {
  data: ListResponse<IDevice[]>;
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: { count: 0, rows: [] },
  isLoading: false,
  error: null,
};

const devicesSlice = createSlice({
  name: "devices",
  initialState: initialState,
  reducers: {
    location: (state, action: PayloadAction<ISocketLocation>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.gps_accuracy = data.gps_accuracy;
      device.direction = parseFloat(data.direction);
      device.gps_time = data.gps_time;
      device.speed = parseFloat(data.speed);
      device.external_power_voltage = data.external_power_voltage;
      device.back_battery_percentage = data.backup_battery_percentage;
      state.data.rows.splice(index, 1, device);
    },
    crash: (state, action: PayloadAction<ISocketNoMileageObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.gps_accuracy = data.gps_accuracy;
      device.direction = parseFloat(data.direction);
      device.gps_time = data.gps_time;
      device.speed = parseFloat(data.speed);
      state.data.rows.splice(index, 1, device);
    },
    batteryInfo: (state, action: PayloadAction<ISocketBatteryObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.battery_level = data.battery_level;
      device.charging_status = data.charging_status;
      device.current = data.current;
      device.direction = data.direction;
      device.power_capacity = data.power_capacity;
      device.temperature = data.temperature;
      device.voltage = data.voltage;
      state.data.rows.splice(index, 1, device);
    },
    batterLow: (state, action: PayloadAction<ISocketBatteryObj<"low">>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.direction = parseFloat(data.direction);
      device.external_power_voltage = data.external_power_voltage;
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.speed = parseFloat(data.speed);
      state.data.rows.splice(index, 1, device);
    },
    ignitionOn: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.direction = parseFloat(data.direction);
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = parseFloat(data.mileage) || 0;
      device.speed = parseFloat(data.speed);
      device.is_idling = true;
      state.data.rows.splice(index, 1, device);
    },
    ignitionOff: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.direction = parseFloat(data.direction);
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = parseFloat(data.mileage) || 0;
      device.speed = parseFloat(data.speed);
      device.is_idling = false;
      state.data.rows.splice(index, 1, device);
    },
    mainPowerOn: (state, action: PayloadAction<ISocketNoMileageObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.direction = parseFloat(data.direction);
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.speed = parseFloat(data.speed);
      state.data.rows.splice(index, 1, device);
    },
    mainPowerOff: (state, action: PayloadAction<ISocketNoMileageObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.direction = parseFloat(data.direction);
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.speed = parseFloat(data.speed);
      state.data.rows.splice(index, 1, device);
    },
    idlingOn: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.direction = parseFloat(data.direction);
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = parseFloat(data.mileage) || 0;
      device.speed = parseFloat(data.speed);
      device.is_idling = true;
      state.data.rows.splice(index, 1, device);
    },
    idlingOff: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.direction = parseFloat(data.direction);
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = parseFloat(data.mileage) || 0;
      device.speed = parseFloat(data.speed);
      device.is_idling = false;
      state.data.rows.splice(index, 1, device);
    },
    virtualIgnitionOn: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.direction = parseFloat(data.direction);
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = parseFloat(data.mileage) || 0;
      device.speed = parseFloat(data.speed);
      device.is_ignition = false;
      state.data.rows.splice(index, 1, device);
    },
    virtualIgnitionOff: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex(
        (device) => device.IMEI === action.payload.IMEI
      );
      if (index === -1) {
        return;
      }
      const device = state.data.rows[index];
      device.direction = parseFloat(data.direction);
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = parseFloat(data.mileage) || 0;
      device.speed = parseFloat(data.speed);
      device.is_ignition = false;
      state.data.rows.splice(index, 1, device);
    },
  },
  extraReducers: (builder) => {
    //---------fetchDevices---------------
    builder.addCase(fetchDevices.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDevices.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload.success
        ? action.payload.data
        : initialState.data;
      state.error = null;
    });
    builder.addCase(fetchDevices.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
      state.data = initialState.data;
    });
  },
});

export { devicesSlice };
export const {
  crash,
  location,
  batteryInfo,
  batterLow,
  ignitionOn,
  ignitionOff,
  mainPowerOn,
  mainPowerOff,
  idlingOn,
  idlingOff,
  virtualIgnitionOn,
  virtualIgnitionOff,
} = devicesSlice.actions;
export const devicesReducer = devicesSlice.reducer;
