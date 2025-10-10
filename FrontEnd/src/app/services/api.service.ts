import axios, { type InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode"; 

interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
}

export const api = axios.create({
  baseURL: "http://localhost:3333/api",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
 
    const token = localStorage.getItem("token"); 

    if (token) {
    
      const decodedToken: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");

        window.location.replace("/login");
        
        return Promise.reject(new Error("Token expirado"));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);