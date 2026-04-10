import { useState } from "react";
import { useParams, Link } from "react-router";
import DOMPurify from "dompurify";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../../../shared/ui/Avatar";
import { useAuth } from "../../../app/providers/AuthProvider";
import { Dialog } from "../../../shared/ui/Dialog";
import { Button } from "../../../shared/ui/Button";
import { usePostDetail } from "./hook";
import { useComments } from "../../comments/post-comments/hook";

export const DetailViewSkeleton = () => (
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
        </div>
      </div>
    </div>
);

export const DetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Strict UI separation achieved! We only consume logic exported via hooks.
  const { post, loading, isDeletingPost, handleLike, handleDeletePost } = usePostDetail(id);
  const { 
    comments, 
    isSubmittingComment, 
    isDeletingComment, 
    handleAddComment, 
    handleDeleteComment 
  } = useComments(id);

  const [replyTo, setReplyTo] = useState<any>(null);
  const [commentContent, setCommentContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const onSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleAddComment(commentContent, replyTo?.id);
    if (success) {
      setCommentContent("");
      setReplyTo(null);
    }
  };

  const onConfirmDeleteComment = async () => {
    if (!commentToDelete) return;
    await handleDeleteComment(commentToDelete);
    setCommentToDelete(null);
  }

  if (loading) return <DetailViewSkeleton />;
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
                <Link to={`/edit-post/${post.id}`} className="text-black bg-[#f0f0f0] border border-[#333333] hover:bg-[#e0e0e0] px-3 py-1 text-xs font-bold transition">
                  Edit
                </Link>
                <button onClick={() => setShowDeleteModal(true)} className="text-white bg-red-600 border border-red-700 hover:bg-red-700 px-3 py-1 text-xs font-bold transition cursor-pointer">
                  Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="text-xl font-bold text-black mb-4">{post.title}</h1>
          <div className="prose max-w-none text-black" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
          
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
          <button onClick={handleLike} className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold transition border border-transparent ${post.isLikedByMe ? "bg-black text-white hover:bg-gray-800" : "bg-[#f0f0f0] text-black border-[#333333] hover:bg-[#e0e0e0]"}`}>
            {post.isLikedByMe ? "Liked" : "Like"}
          </button>
          <button onClick={() => document.getElementById("commentInput")?.focus()} className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-[#f0f0f0] border border-[#333333] text-black text-xs font-bold hover:bg-[#e0e0e0] transition cursor-pointer">
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
          
          <form onSubmit={onSubmitComment} className="flex gap-3 items-start">
            <Avatar fallback={user?.username || "?"} src={user?.avatarUrl} />
            <div className="flex-1 flex gap-2">
              <input id="commentInput" type="text" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Write a comment..." className="w-full bg-white border border-[#333333] py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#333333]" />
              <Button type="submit" disabled={!commentContent.trim() || isSubmittingComment} isLoading={isSubmittingComment}>Post</Button>
            </div>
          </form>
          
          <div className="mt-6 flex flex-col gap-1">
            {comments.length > 0 ? renderComments(comments) : <p className="text-black opacity-70 text-center py-4 text-sm font-bold">No comments yet. Be the first!</p>}
          </div>
        </div>
      </div>

      <Dialog isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Post" description="Are you sure you want to delete this post?" onConfirm={handleDeletePost} confirmText="Yes" cancelText="No" variant="danger" isLoading={isDeletingPost} />
      <Dialog isOpen={!!commentToDelete} onClose={() => setCommentToDelete(null)} title="Delete Comment" description="Are you sure you want to delete this comment?" onConfirm={onConfirmDeleteComment} confirmText="Yes" cancelText="No" variant="danger" isLoading={isDeletingComment} />
    </div>
  );
};
