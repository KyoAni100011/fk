import { api } from "../../../core/api/client";
import { USER_API_BASE_URL } from "../../../core/config/url";

export const updateUsername = async (username: string) => {
  const result = await api.put(`${USER_API_BASE_URL}/username`, { username });
  return result.data;
};

export const updatePassword = async (oldPassword: string, newPassword: string) => {
  const result = await api.put(`${USER_API_BASE_URL}/password`, { oldPassword, newPassword });
  return result.data;
};
