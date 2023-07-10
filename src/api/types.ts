type FailedResponse = {
  success: false;
  message: string;
};

type SuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
};

type ApiResponse<T> = FailedResponse | SuccessResponse<T>;
