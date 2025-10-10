import axios from "axios";
import type { loginProps } from "../../interfaces/login";
import { api } from "../api.service";

export async function authenticationLogin(
  data: loginProps,
  setMessage: (message: string, severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast" | undefined, summary: string) => void
): Promise<boolean> {
  try {
    const response = await api.post("/users/login", data);
    localStorage.setItem("token", response.data.token);
    setMessage("Login realizado com sucesso!", 'success', 'Sucesso');
    return true; 
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      setMessage(serverMessage, 'error', 'Erro');
    }
    return false;
  }
}
