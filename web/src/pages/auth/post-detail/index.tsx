import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import DOMPurify from "dompurify";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../../../core/components/ui/Avatar";
import { useAuth } from "../../../core/AuthProvider";
import { getPost, deletePost } from "../../../core/services/post";
import { toggleLike } from "../../../core/services/like";
import { getComments, addComment, deleteComment as delComment } from "../../../core/services/comment";
import { useAlert } from "../../../core/AlertContext";
import { Dialog } from "../../../core/components/ui/Dialog";
import { Button } from "../../../core/components/ui/Button";

const PostDetailSkeleton = () => (
  <div className="w-full max-w-2xl mx-auto pb-10">
    <div className="inline-flex items-center text-sm font-bold text-black opacity-50 mb-4">&larr; Back to Feed</div>
    <div className="bg-white border border-[#333333] animate-pulse">
      <div className="p-4 md:p-5">
        <div className="flex items-start mb-4">
          <div className="w-10 h-10 border border-[#333333] bg-[#e0e0e0]" />
          <div className="ml-3 mt-1 flex flex-col gap-2">
            <div className="w-24 h-3 bg-[#e0e0e0]" />
            <div className="w-16 h-2 bg-[#e0e0e0]" />
          </div>
        </div>
        <div className="w-2/3 h-6 bg-[#e0e0e0] mb-4" />
        <div className="flex flex-col gap-3">
          <div className="w-full h-4 bg-[#e0e0e0]" />
          <div className="w-full h-4 bg-[#e0e0e0]" />
          <div className="w-5/6 h-4 bg-[#e0e0e0]" />
          <div className="w-3/4 h-4 bg-[#e0e0e0]" />
        </div>
        <div className="mt-6 pt-3 border-t border-[#333333] flex justify-between">
          <div className="w-16 h-3 bg-[#e0e0e0]" />
          <div className="w-20 h-3 bg-[#e0e0e0]" />
        </div>
      </div>
      <div className="border-t border-[#333333] flex px-1 py-1 gap-1">
        <div className="flex-1 h-8 bg-[#f0f0f0] border border-[#333333]" />
        <div className="flex-1 h-8 bg-[#f0f0f0] border border-[#333333]" />
      </div>
      <div className="p-4 md:p-5 border-t border-[#333333] bg-[#f9f9f9]">
        <div className="flex gap-3 mb-6 items-start">
          <div className="w-8 h-8 border border-[#333333] bg-[#e0e0e0]" />
          <div className="flex-1 h-9 bg-white border border-[#333333]" />
          <div className="w-16 h-9 bg-[#e0e0e0] border border-[#333333]" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="w-8 h-8 border border-[#333333] bg-[#e0e0e0]" />
            <div className="flex-1">
              <div className="w-48 h-10 bg-[#e0e0e0] border border-[#333333]" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 border border-[#333333] bg-[#e0e0e0]" />
            <div className="flex-1">
              <div className="w-64 h-16 bg-[#e0e0e0] border border-[#333333]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<any>(null);
  const [commentContent, setCommentContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  const fetchPostAndComments = async () => {
    if (!id) return;
    try {
      const p = await getPost(id);
      setPost(p);
      const c = await getComments(id);
      setComments(c);
    } catch {
      showAlert("Failed to load post", "Error", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

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

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentContent.trim()) return;
    setIsSubmittingComment(true);
    try {
      await addComment(id, commentContent, replyTo?.id);
      setCommentContent("");
      setReplyTo(null);
      await fetchPostAndComments();
    } catch {
      showAlert("Failed to post comment", "Error", "danger");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!id) return;
    setIsDeletingPost(true);
    try {
      await deletePost(id);
      setShowDeleteModal(false);
      navigate("/");
    } catch {
      showAlert("Failed to delete", "Error", "danger");
    } finally {
      setIsDeletingPost(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    setIsDeletingComment(true);
    try {
      await delComment(commentToDelete);
      setCommentToDelete(null);
      await fetchPostAndComments();
    } catch {
      showAlert("Failed to delete comment", "Error", "danger");
    } finally {
      setIsDeletingComment(false);
    }
  };

  if (loading) return <PostDetailSkeleton />;
  if (!post) return <div className="p-4 text-center font-bold text-black border border-[#333333] bg-[#f0f0f0]">POST NOT FOUND</div>;

  const renderComments = (commentList: any[]) => {
    return commentList.map(c => (
      <div key={c.id} className="mt-3 w-full">
        <div className="flex gap-2">
          <Avatar fallback={c.user.username} src={c.user.avatarUrl} className="mt-1" />
          <div className="flex-1">
            <div className="bg-white border border-[#333333] px-3 py-2 inline-block">
              <span className="font-bold text-black text-sm mr-2">{c.user.username}</span>
              <p className="text-black text-sm">{c.content}</p>
            </div>
            <div className="mt-1 ml-1 flex items-center gap-3 text-xs font-bold text-black opacity-70">
              <span>{formatDistanceToNow(new Date(c.createdAt))}</span>
              <button onClick={() => setReplyTo(c)} className="hover:underline">Reply</button>
              {user?.id === c.userId && (
                <button onClick={() => setCommentToDelete(c.id)} className="hover:underline text-red-600">Delete</button>
              )}
            </div>
            {c.replies?.length > 0 && (
              <div className="ml-2 border-l border-[#333333] pl-2 mt-2">
                {renderComments(c.replies)}
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-10">
      <Link to="/" className="inline-flex items-center text-sm font-bold text-black hover:underline mb-4 transition">
        &larr; Back to Feed
      </Link>
      
      <div className="bg-white border border-[#333333]">
        <div className="p-4 md:p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Avatar fallback={post.user.username} src={post.user.avatarUrl} className="w-10 h-10 text-base" />
              <div>
                <h3 className="font-bold text-black text-sm leading-tight">{post.user.username}</h3>
                <p className="text-xs text-black opacity-70 hover:underline cursor-pointer">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {user?.id === post.userId && (
              <div className="flex gap-2">
                <Link 
                  to={`/edit-post/${post.id}`}
                  className="text-black bg-[#f0f0f0] border border-[#333333] hover:bg-[#e0e0e0] px-3 py-1 text-xs font-bold transition"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => setShowDeleteModal(true)} 
                  className="text-white bg-red-600 border border-red-700 hover:bg-red-700 px-3 py-1 text-xs font-bold transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="text-xl font-bold text-black mb-4">{post.title}</h1>
          <div 
            className="prose max-w-none text-black"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
          
          <div className="mt-6 pt-3 flex items-center justify-between text-black text-xs font-bold border-t border-[#333333]">
            <span className="flex items-center gap-1 cursor-pointer hover:underline">
              Like ({post._count?.likes})
            </span>
            <span>
              Comment ({post._count?.comments})
            </span>
          </div>
        </div>

        <div className="border-t border-[#333333] flex px-1 py-1 gap-1">
          <button 
            onClick={handleLike} 
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold transition border border-transparent ${
              post.isLikedByMe ? "bg-black text-white hover:bg-gray-800" : "bg-[#f0f0f0] text-black border-[#333333] hover:bg-[#e0e0e0]"
            }`}
          >
            {post.isLikedByMe ? "Liked" : "Like"}
          </button>
          <button 
            onClick={() => document.getElementById("commentInput")?.focus()}
            className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-[#f0f0f0] border border-[#333333] text-black text-xs font-bold hover:bg-[#e0e0e0] transition cursor-pointer"
          >
            Comment
          </button>
        </div>

        <div className="p-4 md:p-5 border-t border-[#333333] bg-[#f9f9f9]">
          {replyTo && (
            <div className="mb-3 text-xs bg-white text-black p-2 border border-[#333333] flex justify-between items-center">
              <span>Replying to <span className="font-bold">{replyTo.user.username}</span></span>
              <button onClick={() => setReplyTo(null)} className="font-bold hover:underline text-sm leading-none">&times;</button>
            </div>
          )}
          
          <form onSubmit={handleComment} className="flex gap-3 items-start">
            <Avatar fallback={user?.username || "?"} src={user?.avatarUrl} />
            <div className="flex-1 flex gap-2">
              <input 
                id="commentInput"
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-white border border-[#333333] py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#333333]"
              />
              <Button 
                type="submit" 
                disabled={!commentContent.trim() || isSubmittingComment}
                isLoading={isSubmittingComment}
              >
                Post
              </Button>
            </div>
          </form>
          
          <div className="mt-6 flex flex-col gap-1">
            {comments.length > 0 ? renderComments(comments) : (
              <p className="text-black opacity-70 text-center py-4 text-sm font-bold">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>

      <Dialog 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post"
        description="Are you sure you want to delete this post?"
        onConfirm={handleDeletePost}
        confirmText="Yes"
        cancelText="No"
        variant="danger"
        isLoading={isDeletingPost}
      />

      <Dialog 
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        title="Delete Comment"
        description="Are you sure you want to delete this comment?"
        onConfirm={handleDeleteComment}
        confirmText="Yes"
        cancelText="No"
        variant="danger"
        isLoading={isDeletingComment}
      />
    </div>
  );
};
