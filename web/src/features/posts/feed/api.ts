import { api } from "../../../core/api/client";
import { POST_API_BASE_URL } from "../../../core/config/url";

export const getPosts = async (page = 1, limit = 10, userId?: string) => {
  let url = `${POST_API_BASE_URL}?page=${page}&limit=${limit}`;
  if (userId) url += `&userId=${userId}`;
  const result = await api.get(url);
  return result.data;
};
