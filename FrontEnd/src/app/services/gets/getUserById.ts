import { api } from "../api.service";

export interface UserPublicProfile {
  id: string;
  username: string;
  created_at: string;
}

export const getUserById = async (id: string): Promise<UserPublicProfile> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};