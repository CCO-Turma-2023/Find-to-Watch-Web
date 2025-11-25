import { api } from "../api.service";
import type { Lista } from "../../interfaces/list";

interface CreateListParams {
  name: string;
  isPublic: boolean;
}

export const createList = async (params: CreateListParams): Promise<Lista> => {
  const { data } = await api.post("/listas/createListas", params);
  return data;
};