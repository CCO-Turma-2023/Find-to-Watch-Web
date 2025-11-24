import { api } from "../api.service";

interface SaveFilmParams {
  filmId: number;
  listId: number;
}

export async function saveFilm({ filmId, listId }: SaveFilmParams) {
  try {
    const response = await api.post("/listas/addFilm", {
      filmId,
      listId,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar filme na lista:", error);
    throw error;
  }
}
