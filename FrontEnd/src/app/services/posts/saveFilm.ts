import { api } from "../api.service";

interface SaveFilmParams {
  mediaId: number;
  listId: string;
}

export async function saveFilm({ mediaId, listId }: SaveFilmParams) {
  try {
    const response = await api.post(`/listas/insertMedia/${listId}`, {
      media_id: mediaId,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao inserir mídia na lista:", error);
    throw error;
  }
}
