export { reverseGeocode, getDirections } from "./google-services";
export {
  apiLogin,
  changePassword,
  deleteAccount,
  updateDevicePushToken,
} from "./auth";
export { getDashCounts } from "./common";
export {
  getDevicesList,
  addDevice,
  getVehicleList,
  addVehicle,
  deleteVehicle,
  updateVehicle,
  getVehicleById,
  getPoiCounts,
  getPoiList,
  deletePoi,
  addPoi,
  updatePoi,
  getFuelTypes,
  getNotificationsList,
  createGeoFence,
  updateGeoFence,
  deleteGeoFence,
  getGeoFenceById,
  getGeoFenceByDeviceId,
  getGeoFenceList,
  getDayTrip,
  getTripDetails,
  getTripsDates,
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
  addDriverBehavior,
  getDriverBehaviorByDriverId,
  getBehaviorEventTypes as getEventTypes,
  addTask,
  endTask,
  getCheckList,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  getTaskList,
  qrScanDeviceDetails,
  addDriverWorkingTime,
  availableStatusToggle,
} from "./drivers";

export {
  getHistoryReport,
  getIgnitionReport,
  getAlarmReport,
  getIdlingReport,
  getMaintenanceReport,
  getUtilizationReport,
} from "./reports";
