type LoginRequest = {
  email: string;
  password: string;
  fcm_token: string;
};
type LoginResponse = ApiResponse<ILoginUserData> & { token: string };

type ChangePasswordRequest = {
  old_password: string;
  new_password: string;
};

type ChangePasswordResponse = MessageResponse;
