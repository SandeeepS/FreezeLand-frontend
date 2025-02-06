import axios, { AxiosInstance } from "axios";

const Api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Api.interceptors.request.use(
//   (config) => {
//     const accessTokenMatch = document.cookie.match(/access_token=([^;]*)/);
//     console.log("acces toekn is ",accessTokenMatch)
//     if (accessTokenMatch && accessTokenMatch[1]) {
//       config.headers.Authorization = `Bearer ${accessTokenMatch[1]}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default Api;