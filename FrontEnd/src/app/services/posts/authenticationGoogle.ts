import axios from "axios";
import { api } from "../api.service";

type GoogleAuthProps = {
  code: string;
};

export async function authenticationGoogle(
  data: GoogleAuthProps,
  setMessage: (message: string, severity: "error" | "success" | "info" | "warn", summary: string) => void
): Promise<boolean> {
  try {
    const response = await api.post("/users/google", data); 
    
    localStorage.setItem("token", response.data.token);
    
    setMessage("Login com Google realizado com sucesso!", 'success', 'Sucesso');
    return true; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message || "Ocorreu um erro no servidor.";
      setMessage(serverMessage, 'error', 'Erro');
    }
    return false;
  }
}