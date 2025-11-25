import axios, { type InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id: string;
  username: string;
  email: string;
  exp: number;
  iat: number;
}

export const decodeToken = (): DecodedToken | undefined => {
  const token = localStorage.getItem("token");
  if (!token) return undefined;
  
  try {
    return jwtDecode(token);
  } catch {
    return undefined;
  }
};

export const isTokenValid = (): boolean => {
  const decodedToken = decodeToken();
  if (!decodedToken) return false;

  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

export const api = axios.create({
  baseURL: "http://localhost:3333/api",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const optionalAuthRoutes = [
      "/users/login",
      "/users",
      "/users/google",
      "/tmdb/category",
      "/listas/getMediaByListId", 
      "/listas/getListasById",    
      "/tmdb/details/tv",
      "/tmdb/details/movie",
      "/tmdb/search"
    ];

    const isOptionalRoute = config.url && optionalAuthRoutes.some((route) => config.url!.startsWith(route));
    const hasValidToken = isTokenValid();

    // Lógica 1: Se o token é válido, SEMPRE injeta o header.
    // Isso garante que se eu sou dono de uma lista privada, o backend saberá quem sou eu.
    if (hasValidToken) {
      const token = localStorage.getItem("token");
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // Lógica 2: Se não tem token válido, mas a rota é opcional/pública, deixa passar sem header.
    if (isOptionalRoute) {
      return config;
    }

    // Lógica 3: Se não tem token e a rota é privada, bloqueia e redireciona.
    localStorage.removeItem("token");

    if (window.location.pathname !== "/auth") {
      window.location.replace("/auth");
    }

    return Promise.reject(new Error("Token expirado ou necessário para esta ação."));
  },
  (error) => {
    return Promise.reject(error);
  },
);