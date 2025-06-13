import axios, { AxiosInstance } from "axios";

const Api: AxiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "http://freezeland.online/api",
  withCredentials: true,
});

export default Api;
