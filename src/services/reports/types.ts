type GetHistoryReportRequest = {
  IMEI: string;
  startDate: string;
  endDate: string;
  page?: number;
};
interface IHistoryReport {
  latitude: string;
  longitude: string;
  mileage: string;
  speed: string;
  gps_accuracy: string;
  gps_time: string;
  createdAt: string;
}
type GetHistoryReportResponse = ApiResponse<IHistoryReport[], "result">;

type GetIgnitionReportRequest = {
  IMEI: string;
  startDate: string;
  endDate: string;
};
interface IIgnitionReport {
  touch_id: null;
  start_time: string;
  end_time: string;
  gps_start_time: string;
  gps_end_time: string;
  start_latitude: string;
  start_longitude: string;
  end_latitude: string;
  end_longitude: string;
  start_mileage: string;
  end_mileage: string;
  total_distance: string;
  duration: number;
  _id: string;
  device_id: number;
  id: number;
  createdAt: string;
  __v: number;
}

type GetIgnitionReportResponse = ApiResponse<IIgnitionReport[], "result">;

type GetUtilizationReportRequest = {
  vehicleId: string;
  startDate: string;
  endDate: string;
};
interface IUtilizationReport {
  id: number;
  vehicle_id: number;
  checklist: string;
  start_time: string;
  end_time: string;
  user_id: number;
  is_active: true;
  createdAt: string;
  updatedAt: string;
  driver_name: string;
}

type GetUtilizationReportResponse = ApiResponse<IUtilizationReport[], "result">;

type GetIdlingReportRequest = {
  IMEI: string;
  startDate: string;
  endDate: string;
};

interface IIdlingReport {
  start_time: string;
  end_time: string;
  gps_start_time: string;
  gps_end_time: string;
  start_latitude: string;
  start_longitude: string;
  end_latitude: string;
  end_longitude: string;
  duration: number;
  _id: string;
  device_id: number;
  id: number;
  createdAt: string;
  __v: number;
}

type GetIdlingReportResponse = ApiResponse<IIdlingReport[], "result">;

type GetMaintenanceReportRequest = {
  vehicleId: string;
  startDate: string;
  endDate: string;
};
interface IMaintenanceReport {
  id: number;
  vehicle_id: number;
  type_id: number;
  pictures: string[] | string;
  description: string;
  service_date: string;
  status_id: number;
  user_id: number;
  updated_by: null | number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  status_name: string;
  type_name: string;
}

type GetMaintenanceReportResponse = ApiResponse<IMaintenanceReport[], "result">;

type GetAlarmReportRequest = {
  IMEI: string;
  startDate: string;
  endDate: string;
};
interface IAlarmReport {
  id: number;
  device_id: number;
  latitude: string;
  longitude: string;
  external_power_voltage: null;
  back_battery_percentage: null;
  mileage: number;
  speed: number;
  touch_id: null;
  gps_accuracy: string;
  motion_state: null;
  is_alarm: true;
  gps_time: string;
  direction: number;
  command_type_id: number;
  is_active: boolean;
  is_idling: boolean;
  is_ignition: boolean;
  createdAt: string;
  updatedAt: string;
  command_type: string;
}
type GetAlarmReportResponse = ApiResponse<
  ListResponse<IAlarmReport[]>,
  "result"
>;
