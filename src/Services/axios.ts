import axios, { AxiosInstance } from "axios";

const Api: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL_PROD ||
    import.meta.env.VITE_API_BASE_URL_DEV,
  withCredentials: true,
});

console.log('apii is ',Api)

export default Api;
