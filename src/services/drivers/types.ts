type DriversResponse = ApiResponse<ListResponse<IDriver[]>>;

type DriverResponse = ApiResponse<IDriver>;

type UpdateDriverRequest = {
  id: number;
  name: string;
  ic_number: string;
  touch_id: string;
  mobile_number: string;
  joining_date: string;
  experience_in_year: string;
  license_type: string;
  license_number: string;
  license_expiry: string;
  department: string;
  email: string;
  password: string;
  dob: string;
};
type UpdateDriverResponse = ApiResponse<IDriver>;

type AddDriverRequest = {
  name: string;
  ic_number: string;
  touch_id: string;
  mobile_number: string;
  joining_date: string;
  experience_in_year: string;
  license_type: string;
  license_number: string;
  license_expiry: string;
  department: string;
  email: string;
  password: string;
  dob: string;
  rating: number;
  picture?: string;
};
type AddDriverResponse = ApiResponse<IDriver>;

type DeleteDriverResponse = MessageResponse;

type AssignVehicleRequest = {
  driver_id: number;
  vehicle_ids: number[];
};

interface AssignedVehicle {
  //response when you assign a vehicle to a driver
  id: number;
  driver_id: number;
  vehicle_id: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

type AssignVehicleResponse = ApiResponse<AssignedVehicle[]>;

type GetAssignedVehicleResponse = ApiResponse<IGetAssignedVehicle[]>;

type AddDriverBehaviorRequest = {
  driver_id: number;
  event_type_id: number;
  behavior_date: string;
  description: string;
};

type AddDriverBehaviorResponse = ApiResponse<{
  id: number;
  driver_id: number;
  event_type_id: number;
  behavior_date: string;
  description: string;
  user_id: number;
  updatedAt: string;
  createdAt: string;
}>;

type DriverBehaviorResponse = ApiResponse<ListResponse<IDriverActivity[]>>;

type DriverBehaviorEventType = ApiResponse<
  {
    id: number;
    name: string;
    rating: number;
    is_active: boolean;
    createdAt: string;
    updatedAt: null | string;
  }[]
>;

type QRScanDeviceDetailsResponse = ApiResponse<QRScanDeviceDetails, "result">;

type ChecklistListResponse = ApiResponse<IChecklist[]>;
type ChecklistRecordResponse = ApiResponse<IChecklist>;
type AddChecklistItemRequest = { name: string };
type UpdateChecklistItemRequest = { id: number; name: string };

type AddNewTaskRequest = {
  vehicle_id: number;
  checklist: string; //"Tyre Ok, Body Change, Body Ok, Brake Ok",
  start_time: string;
};

type AddNewTaskResponse = ApiResponse<
  Omit<
    ITask,
    | "end_time"
    | "user_id"
    | "is_active"
    | "vehicle_reg_no"
    | "vehicle_icon"
    | "IMEI"
    | "driver_name"
  >
>;

type EndTaskRequest = {
  task_id: number;
  end_time: string;
};

type EndTaskResponse = MessageResponse;

type GetTaskListResponse = ApiResponse<ListResponse<ITask[]>>;

type AddWorkingTimeRequest = {
  id: number;
  start_date_time: string;
  end_date_time: string;
};
type AddWorkingTimeResponse = ApiResponse<IDriver>;
