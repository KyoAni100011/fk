import { useState, useCallback, useEffect } from "react";
import { getComments, addComment, deleteComment as delComment } from "./api";
import { useAlert } from "../../../app/providers/AlertContext";

export const useComments = (postId?: string) => {
  const { showAlert } = useAlert();
  
  const [comments, setComments] = useState<any[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    try {
      const c = await getComments(postId);
      setComments(c);
    } catch {
      // showAlert("Failed to load comments", "Error", "danger");
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (content: string, replyToId?: string) => {
    if (!postId || !content.trim()) return false;
    setIsSubmittingComment(true);
    try {
      await addComment(postId, content, replyToId);
      await fetchComments();
      return true;
    } catch {
      showAlert("Failed to post comment", "Error", "danger");
      return false;
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsDeletingComment(true);
    try {
      await delComment(commentId);
      await fetchComments();
      return true;
    } catch {
      showAlert("Failed to delete comment", "Error", "danger");
      return false;
    } finally {
      setIsDeletingComment(false);
    }
  };

  return { 
    comments, 
    isSubmittingComment, 
    isDeletingComment, 
    handleAddComment, 
    handleDeleteComment 
  };
};
