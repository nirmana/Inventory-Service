import axios from "axios";
import { BASE_URL } from "../types/config";
import { getAccessToken } from "./auth.service";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    const auth = token ? `Bearer ${token}` : "";
    config.headers = { Authorization: auth }; //common["Authorization"] = auth;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
