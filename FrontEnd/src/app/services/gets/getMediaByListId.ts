import { api } from "../api.service"; 


export const getMediaByListId = async (id: string | number) => {
  const { data } = await api.get(`/listas/getMediaByListId/${id}`);
  return data;
};