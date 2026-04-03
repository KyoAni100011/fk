import { api } from "../libs/axios";
import { POST_API_BASE_URL } from "../constants/url";

export const getPosts = async (page = 1, limit = 10, userId?: string) => {
  let url = `${POST_API_BASE_URL}?page=${page}&limit=${limit}`;
  if (userId) url += `&userId=${userId}`;
  const result = await api.get(url);
  return result.data;
};

export const getPost = async (id: string) => {
  const result = await api.get(`${POST_API_BASE_URL}/${id}`);
  return result.data;
};

export const createPost = async (payload: { title: string; content: string }) => {
  const result = await api.post(POST_API_BASE_URL, payload);
  return result.data;
};

export const updatePost = async (id: string, payload: { title?: string; content?: string }) => {
  const result = await api.put(`${POST_API_BASE_URL}/${id}`, payload);
  return result.data;
};

export const deletePost = async (id: string) => {
  const result = await api.delete(`${POST_API_BASE_URL}/${id}`);
  return result.data;
};
