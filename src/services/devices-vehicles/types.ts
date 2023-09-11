type DevicesListResponse = ApiResponse<ListResponse<IDevice[]>>;
type AddDeviceRequest = {
  IMEI: string;
  device_type_id: number;
  sim_no: string;
};
type AddDeviceResponse = ApiResponse<{
  id: number;
  IMEI: string;
  device_type_id: number;
  sim_no: string;
  activation_status: number;
  updatedAt: string;
  createdAt: string;
}>;

type VehicleListResponse = ApiResponse<ListResponse<IVehicle[]>>;
type VehicleByIdResponse = ApiResponse<IVehicle>;
type DeleteVehicleResponse = MessageResponse;

type FuelTypeListResponse = ApiResponse<ListResponse<IFuelType[]>>;

interface IAddUpdateVehicleRequestBase {
  id: number;
  device_id: number;
  reg_no: string;
  color: string;
  make: string;
  model: string;
  purchase_date: string;
  rent_start_date: string;
  rent_end_date: string;
  serial_number: string;
  battery_serial_number: string;
  year: number;
  age: string;
  mileage: string;
  fuel_type_id: number;
  fuel_capacity: string;
  insurance_company: string;
  insurance_number: string;
  insurance_type: string;
  insurance_expiry_date: string;
  insurance_company_contact: string;
  icon: string;
}
type AddVehicleRequest = Omit<IAddUpdateVehicleRequestBase, "id">;
type AddVehicleResponse = ApiResponse<
  Omit<IVehicle, "fuel_type_name" | "driver_name" | "driver_picture">
>;

type UpdateVehicleRequest = IAddUpdateVehicleRequestBase;
type UpdateVehicleResponse = ApiResponse<
  Omit<IVehicle, "fuel_type_name" | "driver_name" | "driver_picture">
>;

type PoiListResponse = ApiResponse<ListResponse<IPOI[]>>;
type POIPostRequestBase = {
  id: number;
  poi_name: string;
  poi_type: number;
  latitude: string;
  longitude: string;
  address: string;
  color: string;
  marker_shape: string;
  company_name: string;
  company_id: string;
  person: string;
  phone_no: string;
  mobile_no: string;
  email: string;
  // zone_id: number;
};
type POICountResponse = ApiResponse<IPoiCount[]>;
type AddPOIRequest = Omit<POIPostRequestBase, "id">;
type UpdatePOIRequest = Omit<
  POIPostRequestBase,
  "company_name" | "company_id" | "person" | "phone_no" | "mobile_no" | "email"
>;

type POIPostResponseBase = {
  id: number;
  poi_type: number;
  poi_name: string;
  latitude: string;
  longitude: string;
  color: string;
  address: string;
  marker_shape: string;
  zone_id: number;
  user_id: number;
  is_active: boolean;
  updatedAt: string;
  createdAt: string;
};
type AddPOIResponse = ApiResponse<Omit<POIPostResponseBase, "is_active">>;
type UpdatePOIResponse = ApiResponse<POIPostResponseBase, "is_active">;
type DeletePoiResponse = MessageResponse;

type NotificationListResponse = ApiResponse<INotification[], "result">;

type GeoFenceRequestBase = {
  display_name: string;
  latitude: string;
  longitude: string;
  radius: string;
};
type GeoFenceAlertAddon = {
  is_enabled: number;
  alert_enter: number;
  alert_exit: number;
};

type AddGeoFenceRequest = { device_id: number } & GeoFenceRequestBase;
type AddGeoFenceResponse = ApiResponse<
  Omit<IGeoFence, keyof GeoFenceAlertAddon>
>;
type UpdateGeoFenceRequest = { id: number } & Partial<GeoFenceRequestBase>;
type UpdateGeoFenceResponse = ApiResponse<IGeoFence>;
type GeoFenceListResponse = ApiResponse<ListResponse<IGeoFence[]>>;
type GeoFenceByIdResponse = ApiResponse<IGeoFence>;
type DeleteGeoFenceResponse = MessageResponse;
