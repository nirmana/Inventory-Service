import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../types/apiResponse";
import { BASE_URL, V1 } from "../types/config";

export const login = (username: string, password: string) => {
  return axios
    .post(`${BASE_URL}/${V1}/auth/login`, {
      userName: username,
      password: password,
    })
    .then((response: AxiosResponse<ApiResponse<any>>) => {
      if (response.data.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        axios.defaults.headers.common = {'Authorization': `Bearer ${response.data.data.accessToken}`}
      }
      return response.data.data;
    });
};
export const logout = () => {
  return axios.post(`${BASE_URL}/${V1}/auth/logout`, {}).finally(() => {
    localStorage.removeItem("user");
  });
};
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};
export const isAuthenticated = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? true : false;
};
export const getAccessToken = () => {
  const userStr = localStorage.getItem("user") ??"";
  const cookie = JSON.parse(userStr);
  return cookie?.accessToken ? cookie?.accessToken : "";
};