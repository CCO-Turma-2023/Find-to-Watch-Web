import type { fetchMediaProps, Media } from "../../interfaces/media";
import { api } from "../api.service";

export async function getMedias(
  data: fetchMediaProps,
): Promise<Media[] | undefined> {
  try {
    const response = await api.post("/tmdb/category", data);
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
