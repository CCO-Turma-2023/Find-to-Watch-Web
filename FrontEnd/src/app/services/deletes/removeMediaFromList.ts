import { api } from "../api.service";

export const removeMediaFromList = async (
  listId: string | number,
  mediaId: string | number,
) => {
  const response = await api.delete(`/listas/removeMedia/${listId}`, {
    data: { media_id: mediaId },
  });
  return response.data;
};
