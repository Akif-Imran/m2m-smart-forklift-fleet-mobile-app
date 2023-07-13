export { reverseGeocode, getDirections } from "./google-services";
export { apiLogin } from "./auth";
export { getDashCounts } from "./common";
export {
  getDevicesList,
  getVehicleList,
  addVehicle,
  deleteVehicle,
  updateVehicle,
  getVehicleById,
  getPoiList,
  deletePoi,
  addPoi,
  updatePoi,
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
