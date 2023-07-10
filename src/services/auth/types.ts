type LoginRequest = {
  email: string;
  password: string;
};
type LoginResponse = ApiResponse<ILoginUserData> & { token: string };
