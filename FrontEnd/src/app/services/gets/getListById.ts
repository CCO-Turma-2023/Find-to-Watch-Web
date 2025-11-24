import { api, decodeToken } from "../api.service";
import type { Lista } from "../../interfaces/list";
export const getListById = async (id: string | number): Promise<Lista> => {
  const decodedToken = decodeToken();

  const { data } = await api.get(`/listas/getListasById/${id}`, {
    headers: {
      id: decodedToken?.id,
    },
  });
  return data;
};
