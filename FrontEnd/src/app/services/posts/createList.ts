import { api } from "../api.service";

export async function createList({
  name,
  isPublic,
}: {
  name: string;
  isPublic: boolean;
}) {
  try {
    const response = await api.post("/listas/createListas", { name, isPublic });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
