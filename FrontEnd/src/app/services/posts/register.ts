import type { loginProps } from "../../interfaces/login";
import { api } from "../api.service";

export async function authenticationRegister(data: loginProps) {
  try {
    const response = await api.post("/users/", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer registro:", error);
    return false;
  }
}
