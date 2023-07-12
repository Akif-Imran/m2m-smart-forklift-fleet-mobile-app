export { reverseGeocode, getDirections } from "./google-services";
export { apiLogin } from "./auth";
export { getDashCounts } from "./common";
export { getDevicesList, getVehicleList } from "./devices-vehicles";
export {
  getServiceCounts,
  getServices,
  getServiceTypes,
  addService,
  getServiceStatus,
  updateServiceStatus,
  deleteService,
} from "./service";
export {
  getDrivers,
  getDriverById,
  addDriver,
  deleteDriver,
  updateDriver,
  assignVehicles,
  getAssignedVehicles,
} from "./drivers";
