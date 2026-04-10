import { api } from "../../../core/api/client";
import { POST_API_BASE_URL } from "../../../core/config/url";

export const createPost = async (payload: { title: string; content: string }) => {
  const result = await api.post(POST_API_BASE_URL, payload);
  return result.data;
};
