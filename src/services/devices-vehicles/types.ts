type DevicesListResponseType = ApiResponse<
  {
    count: number;
    rows: IDevice[];
  },
  "result"
>;

type VehicleListResponseType = ApiResponse<
  {
    count: number;
    rows: IVehicle[];
  },
  "data"
>;
