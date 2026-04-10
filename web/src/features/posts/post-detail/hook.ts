import { useState, useCallback, useEffect } from "react";
import { getPost, toggleLike } from "./api";
import { deletePost } from "../edit-post/api";
import { useAlert } from "../../../app/providers/AlertContext";
import { useNavigate } from "react-router";

export const usePostDetail = (id?: string) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const p = await getPost(id); // Wait... where is getPost?
      setPost(p);
    } catch {
      showAlert("Failed to load post", "Error", "danger");
    } finally {
      setLoading(false);
    }
  }, [id, showAlert]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleLike = async () => {
    if (!id) return;
    try {
      const result = await toggleLike(id);
      setPost((prev: any) => ({
        ...prev,
        isLikedByMe: result.isLiked,
        _count: { ...prev._count, likes: result.likeCount }
      }));
    } catch {
      showAlert("Failed to toggle like", "Error", "danger");
    }
  };

  const handleDeletePost = async () => {
    if (!id) return false;
    setIsDeletingPost(true);
    try {
      await deletePost(id);
      navigate("/");
      return true;
    } catch {
      showAlert("Failed to delete", "Error", "danger");
      return false;
    } finally {
      setIsDeletingPost(false);
    }
  };

  return { post, loading, isDeletingPost, handleLike, handleDeletePost };
};
