import type { loginProps } from "../../interfaces/login";
import { api } from "../api.service";

export async function authenticationLogin(data: loginProps) {
  try {
    const response = await api.post("/users/login", data);
    localStorage.setItem("token", response.data.token);
    window.location.replace("/home");
    return true;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return false;
  }
}
