import { api } from "../api.service";
import type { Lista } from "../../interfaces/list";

export async function getAllLists(): Promise<Lista[]> {
  try {
    const response = await api.get<Lista[]>("/listas/getAllUserLists");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao buscar listas do usuário:", error);
    return [];
  }
}
