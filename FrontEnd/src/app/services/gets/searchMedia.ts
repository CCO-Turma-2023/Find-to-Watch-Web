import { api } from "../api.service";
import type { Media } from "../../interfaces/media";

export async function searchMedia(query: string): Promise<Media[] | undefined> {
  try {
    const response = await api.get(`/tmdb/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar mídia:", error);
    return undefined;
  }
}
