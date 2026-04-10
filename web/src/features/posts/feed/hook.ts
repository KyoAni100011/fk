import { useState, useCallback, useEffect } from "react";
import { getPosts } from "./api";
import { toggleLike } from "../post-detail/api";
import { useAlert } from "../../../app/providers/AlertContext";

export const usePosts = (userId?: string) => {
  const { showAlert } = useAlert();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchPosts = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      const data = await getPosts(p, 10, userId);
      if (p === 1) setPosts(data.data);
      else setPosts((prev) => [...prev, ...data.data]);
      setHasMore(data.meta.page < data.meta.totalPages);
    } catch {
      showAlert("Failed to load posts", "Error", "danger");
    } finally {
      setLoading(false);
    }
  }, [showAlert, userId]);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  const handleLike = useCallback(async (postId: string) => {
    try {
      const result = await toggleLike(postId);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              isLikedByMe: result.isLiked,
              _count: { ...p._count, likes: result.likeCount },
            };
          }
          return p;
        }),
      );
    } catch {
      showAlert("Failed to toggle like", "Error", "danger");
    }
  }, [showAlert]);

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  return {
    posts,
    loading,
    hasMore,
    handleLike,
    loadMore,
  };
};
