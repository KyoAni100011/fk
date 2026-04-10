import { api } from "../../../core/api/client";
import { COMMENT_API_BASE_URL } from "../../../core/config/url";

export const getComments = async (postId: string) => {
  const result = await api.get(`${COMMENT_API_BASE_URL}/${postId}`);
  return result.data;
};

export const addComment = async (postId: string, content: string, parentId?: string) => {
  const result = await api.post(`${COMMENT_API_BASE_URL}/${postId}`, { content, parentId });
  return result.data;
};

export const deleteComment = async (id: string) => {
  const result = await api.delete(`${COMMENT_API_BASE_URL}/${id}`);
  return result.data;
};
