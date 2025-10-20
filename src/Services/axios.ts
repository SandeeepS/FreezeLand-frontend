import axios, { AxiosInstance } from "axios";

//here is the API
const Api: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL_PROD,
  withCredentials: true,
});

console.log('apii is ',Api)

export default Api;
