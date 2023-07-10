import { apiPost, urls } from "@api";

export const apiLogin = async (body: LoginRequest) => {
  const response = await apiPost<LoginResponse, LoginRequest>(
    urls.auth.login,
    body
  );
  const resData = response.data;
  return resData;
};
