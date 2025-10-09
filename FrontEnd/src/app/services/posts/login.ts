import type { loginProps } from "../../interfaces/login";
import { api } from "../api.service";

export async function authenticationLogin(data: loginProps) {
  try {
    const response = await api.post("/login", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return false;
  }
}
