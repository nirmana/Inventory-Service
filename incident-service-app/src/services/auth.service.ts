import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../types/apiResponse";


const BASE_URL = process.env.BASE_URL || "http://localhost:8080/api";
const V1 = "v1.0";
export const login = (username: string, password: string) => {
console.log(`${BASE_URL}/${V1}/auth/login`);

  return axios
    .post(`${BASE_URL}/${V1}/auth/login`, {
      userName:username,
      password:password,
    })
    .then((response: AxiosResponse<ApiResponse<any>>) => {
      console.log(response.data);
      if (response.data.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
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
