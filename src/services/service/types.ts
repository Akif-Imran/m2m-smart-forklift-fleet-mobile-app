interface ServiceCounts {
  Pending: number;
  Completed: number;
  "In Process": number;
}

type ServiceCountsResponse = ApiResponse<ServiceCounts>;

type ServicesResponse = ApiResponse<ListResponse<IService[]>>;

type ServiceTypesResponse = ApiResponse<IServiceType[]>;

type AddServiceRequest = {
  vehicle_id: number;
  type_id: number;
  description: string;
  pictures: string[];
  service_date: string;
};
type AddServiceResponse = ApiResponse<IService>;
type ServiceStatusResponse = ApiResponse<IServiceStatus[]>;

type UpdateServiceStatusRequest = {
  id: number;
  status_id: number;
};
type UpdateServiceStatusResponse = {
  success: boolean;
  message: string;
};
