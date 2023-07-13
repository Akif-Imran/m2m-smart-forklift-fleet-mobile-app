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