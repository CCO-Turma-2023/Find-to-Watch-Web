import { api } from "../api.service";

export async function getMyLists() {
  try {
    const response = await api.get("/listas/getListasById");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar listas públicas:", error);
    return [];
  }
}
