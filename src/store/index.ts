import type { SerializedError } from "@reduxjs/toolkit";
import { configureStore, createSelector } from "@reduxjs/toolkit";
import {
  alarmsReducer,
  devicesReducer,
  serviceReducer,
  serviceStatusReducer,
  vehiclesReducer,
} from "@slices";
import { useSelector, useDispatch } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

const store = configureStore({
  reducer: {
    alarms: alarmsReducer,
    devices: devicesReducer,
    services: serviceReducer,
    vehicles: vehiclesReducer,
    serviceStatusList: serviceStatusReducer,
  },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type CombinedReduxList<T> = {
  isLoading: boolean;
  error: SerializedError | null;
  data: T;
};

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//selectors
export const selectAlarms = (state: RootState) => state.alarms;
export const selectDevices = (state: RootState) => state.devices;
export const selectServices = (state: RootState) => state.services;
export const selectVehicles = (state: RootState) => state.vehicles;
export const selectServiceStatusList = (state: RootState) =>
  state.serviceStatusList;

//combined selectors
export const selectVehiclesWithDevices = createSelector(
  selectVehicles,
  selectDevices,
  (vehicles, devices) => {
    return {
      isLoading: vehicles.isLoading || devices.isLoading,
      error: vehicles.error || devices.error,
      data: vehicles.data.rows.map((vehicle) => {
        return {
          ...vehicle,
          device: devices.data.rows.find(
            (device) => device.id === vehicle.device_id
          ),
        };
      }),
    };
  }
);
