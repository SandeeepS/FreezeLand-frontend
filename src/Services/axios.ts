import axios, { AxiosInstance } from "axios";

const Api: AxiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://freezeland.space/api",
  withCredentials: true,
});

export default Api;
