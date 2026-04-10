import { api } from '../../../core/api/client';
// "../../../core/api/client";
import { POST_API_BASE_URL } from "../../../core/config/url";

export const getPost = async (id: string) => {
  const result = await api.get(`${POST_API_BASE_URL}/${id}`);
  return result.data;
};


import { LIKE_API_BASE_URL } from "../../../core/config/url";

export const toggleLike = async (postId: string) => {
  const result = await api.post(`${LIKE_API_BASE_URL}/${postId}`);
  return result.data;
};


