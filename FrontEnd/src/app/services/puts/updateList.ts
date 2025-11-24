import { api } from "../api.service";

interface UpdateListData {
  name: string;
  isPublic: boolean;
}

export const updateList = async (
  id: string | number,
  listData: UpdateListData,
) => {
  const { data } = await api.put(`/listas/updateListas/${id}`, listData);
  return data;
};
