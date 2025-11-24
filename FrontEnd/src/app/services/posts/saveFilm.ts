import { api } from "../api.service";

interface SaveFilmParams {
  mediaId: number;
  listId: string;
  setMessage: (
    message: string,
    severity:
      | "error"
      | "success"
      | "info"
      | "warn"
      | "secondary"
      | "contrast"
      | undefined,
    summary: string,
  ) => void;
}

export async function saveFilm({
  mediaId,
  listId,
  setMessage,
}: SaveFilmParams) {
  try {
    const response = await api.post(`/listas/insertMedia/${listId}`, {
      media_id: mediaId,
    });
    setMessage("Conteúdo adicionado à lista com sucesso", "success", "Sucesso");
    return response.data;
  } catch (error) {
    console.error("Erro ao inserir mídia na lista:", error);
    setMessage(
      "Não é possível adicionar conteúdo repetido à lista",
      "error",
      "Erro",
    );
    throw error;
  }
}
