import { api } from "../api.service";
import type { Media } from "../../interfaces/media";

export async function getMediaDetails(
  id: string,
  type: string,
): Promise<Media | null> {
  try {
    const response = await api.get(`/tmdb/details/${type}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes da mídia:", error);
    return null;
  }
}
