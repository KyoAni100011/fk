import { api } from "../libs/axios";
import { LIKE_API_BASE_URL } from "../constants/url";

export const toggleLike = async (postId: string) => {
  const result = await api.post(`${LIKE_API_BASE_URL}/${postId}`);
  return result.data;
};
