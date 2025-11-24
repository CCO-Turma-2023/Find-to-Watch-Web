import { api } from "../api.service";

export const deleteList = async (id: string | number) => {
  const { data } = await api.delete(`/listas/deleteListas/${id}`);
  return data;
};
