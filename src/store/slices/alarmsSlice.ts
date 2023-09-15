import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

import {
  idlingOn,
  idlingOff,
  ignitionOn,
  ignitionOff,
  mainPowerOn,
  mainPowerOff,
  crash,
  batterLow,
  batteryInfo,
} from "./devicesSlice";

interface State {
  alarms: IReduxAlarm[];
}

const initialState: State = {
  alarms: [],
};

const alarmsSlice = createSlice({
  name: "alarms",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(idlingOn, (state, action) => {
      const data = action.payload;
      state.alarms.unshift({
        IMEI: data.IMEI,
        alarmName: data.alarm_name,
        commandTypeId: data.command_type_id,
        deviceName: data.device_name,
        gpsTime: data.gps_time,
      });
    });
    builder.addCase(idlingOff, (state, action) => {
      const data = action.payload;
      state.alarms.unshift({
        IMEI: data.IMEI,
        alarmName: data.alarm_name,
        commandTypeId: data.command_type_id,
        deviceName: data.device_name,
        gpsTime: data.gps_time,
      });
    });

    builder.addCase(ignitionOn, (state, action) => {
      const data = action.payload;
      state.alarms.unshift({
        IMEI: data.IMEI,
        alarmName: data.alarm_name,
        commandTypeId: data.command_type_id,
        deviceName: data.device_name,
        gpsTime: data.gps_time,
      });
    });
    builder.addCase(ignitionOff, (state, action) => {
      const data = action.payload;
      state.alarms.unshift({
        IMEI: data.IMEI,
        alarmName: data.alarm_name,
        commandTypeId: data.command_type_id,
        deviceName: data.device_name,
        gpsTime: data.gps_time,
      });
    });

    builder.addCase(mainPowerOn, (state, action) => {
      const data = action.payload;
      state.alarms.unshift({
        IMEI: data.IMEI,
        alarmName: data.alarm_name,
        commandTypeId: data.command_type_id,
        deviceName: data.device_name,
        gpsTime: data.gps_time,
      });
    });
    builder.addCase(mainPowerOff, (state, action) => {
      const data = action.payload;
      state.alarms.unshift({
        IMEI: data.IMEI,
        alarmName: data.alarm_name,
        commandTypeId: data.command_type_id,
        deviceName: data.device_name,
        gpsTime: data.gps_time,
      });
    });

    builder.addCase(crash, (state, action) => {
      const data = action.payload;
      state.alarms.unshift({
        IMEI: data.IMEI,
        alarmName: data.alarm_name,
        commandTypeId: data.command_type_id,
        deviceName: data.device_name,
        gpsTime: data.gps_time,
      });
    });
    builder.addCase(batterLow, (state, action) => {
      const data = action.payload;
      state.alarms.unshift({
        IMEI: data.IMEI,
        alarmName: data.alarm_name,
        commandTypeId: data.command_type_id,
        deviceName: data.device_name,
        gpsTime: data.gps_time,
      });
    });
    builder.addCase(batteryInfo, (state, action) => {
      const data = action.payload;
      state.alarms.unshift({
        IMEI: data.IMEI,
        alarmName: "Battery Info",
        commandTypeId: data.command_type_id,
        deviceName: "",
        gpsTime: moment().utc().toISOString(),
      });
    });
  },
});

export { alarmsSlice };
// export const {} = alarmsSlice.actions;
export const alarmsReducer = alarmsSlice.reducer;
