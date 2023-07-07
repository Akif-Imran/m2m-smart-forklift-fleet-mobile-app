interface IForklift {
  _id: string;
  regNo: string;
  color: string;
  imei: string;
  simNo: string;
  make: string;
  model: string; //list
  manufactureYear: string;
  milage: string;
  age: string;
  image: string; //list
  name: string; //list
  driver: string; //list
  status: string; //list
  purchaseDate: string;
  rentStartDate: string;
  rentEndDate: string;
  forkliftSerialNo: string;
  batterySerialNo: string;
  fuelType: string;
  fuelCapacity: string;
  insuranceCompany: string;
  insuranceNo: string;
  insuranceType: string;
  insuranceExpiryDate: string;
}

interface INotification {
  _id: string;
  regNo: string;
  model: string;
  date: string;
  driver: string;
  event: string;
  description: string;
}

interface IService {
  _id: string;
  regNo: string;
  date: string;
  type: string;
  description: string;
  status: string;
}

interface IDriver {
  _id: string;
  image: string;
  name: string;
  email: string;
  rating: number;
  touchId: string;
  department: string;
  ic_number: string;
  password: string;
  mobileNo: string;
  joiningDate: string;
  experience: string;
  licenseType: string;
}
interface IDriverActivity {
  _id: string;
  image: string;
  name: string;
  email: string;
  eventType: string;
  description: string;
  date: string;
}
interface IPoi {
  _id: string;
  name: string;
  type: "private" | "business";
  latitude: number;
  longitude: number;
  address: string;
  iconName: string;
  color: string;
}

interface CoordinatesType {
  latitude: number;
  longitude: number;
}

interface IMapPoint {
  latitude: number;
  longitude: number;
  name: string;
}
