import { api } from "../api.service";
import type { Lista } from "../../interfaces/list";

export const getListById = async (id: string | number): Promise<Lista> => {
  const { data } = await api.get(`/listas/getListasById/${id}`);
  return data;
};