import { CURRENT_USER, USER_API_BASE_URL } from "../constants/url";
import { api } from "../libs/axios";

export const getCurrentUser = async () => {
  const result = await api.get(CURRENT_USER);
  return result.data;
};

export const updateUsername = async (username: string) => {
  const result = await api.put(`${USER_API_BASE_URL}/username`, { username });
  return result.data;
};

export const updatePassword = async (oldPassword: string, newPassword: string) => {
  const result = await api.put(`${USER_API_BASE_URL}/password`, { oldPassword, newPassword });
  return result.data;
};
