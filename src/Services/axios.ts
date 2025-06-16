import axios, { AxiosInstance } from "axios";

//use this isUsingProduction false for locally testing 
const isUsingProduction = true; 

const Api: AxiosInstance = axios.create({
  baseURL: isUsingProduction
    ? import.meta.env.VITE_API_BASE_URL_PROD
    : import.meta.env.VITE_API_BASE_URL_DEV,
  withCredentials: true,
});
export default Api;
