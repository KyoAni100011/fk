import { api } from "../../../core/api/client";
import { POST_API_BASE_URL } from "../../../core/config/url";

export const updatePost = async (id: string, payload: { title?: string; content?: string }) => {
  const result = await api.put(`${POST_API_BASE_URL}/${id}`, payload);
  return result.data;
};

export const deletePost = async (id: string) => {
  const result = await api.delete(`${POST_API_BASE_URL}/${id}`);
  return result.data;
};
