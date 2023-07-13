export { reverseGeocode, getDirections } from "./google-services";
export { apiLogin } from "./auth";
export { getDashCounts } from "./common";
export {
  getDevicesList,
  addDevice,
  getVehicleList,
  addVehicle,
  deleteVehicle,
  updateVehicle,
  getVehicleById,
  getPoiList,
  deletePoi,
  addPoi,
  updatePoi,
  getFuelTypes,
  getNotificationsList,
} from "./devices-vehicles";
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
