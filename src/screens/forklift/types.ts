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
  year: string;
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
  name: string;
}
