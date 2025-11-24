import { api, decodeToken } from "../api.service";

export const getMediaByListId = async (id: string | number) => {
  const DecodedToken = decodeToken();
  const { data } = await api.get(`/listas/getMediaByListId/${id}`, {
    headers: {
      id: DecodedToken?.id,
    },
  });
  return data;
};
