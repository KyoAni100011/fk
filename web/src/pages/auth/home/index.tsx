import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import DOMPurify from "dompurify";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../../../core/components/ui/Avatar";
import { Card } from "../../../core/components/ui/Card";
import { getPosts } from "../../../core/services/post";
import { toggleLike } from "../../../core/services/like";
import { useAuth } from "../../../core/AuthProvider";
import { useAlert } from "../../../core/AlertContext";

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchPosts = async (p = 1) => {
    try {
      const data = await getPosts(p, 10);
      if (p === 1) setPosts(data.data);
      else setPosts((prev) => [...prev, ...data.data]);
      setHasMore(data.meta.page < data.meta.totalPages);
    } catch {
      showAlert("Failed to load posts", "Error", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleLike = async (postId: string) => {
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
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-2xl mx-auto pb-10">
      <Card 
        className="p-3 flex gap-3 items-center cursor-pointer hover:bg-[#f9f9f9] transition"
        onClick={() => navigate("/create-post")}
      >
        <Avatar fallback={user?.username || "?"} />
        <div className="flex-1 bg-white border border-[#333333] py-1.5 px-3 text-black text-sm hover:bg-[#f0f0f0] transition">
          What's on your mind, {user?.username}?
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar fallback={post.user.username} />
                <div>
                  <h3 className="font-bold text-black text-sm leading-tight">{post.user.username}</h3>
                  <p className="text-xs text-black hover:underline cursor-pointer opacity-70">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <Link to={`/post/${post.id}`}>
                <h2 className="text-base font-bold text-black mb-2 hover:underline">{post.title}</h2>
              </Link>
              
              <div 
                className="prose prose-sm max-w-none text-black line-clamp-4"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />
            </div>
            
            <div className="px-4 py-2 flex items-center justify-between text-black text-xs border-y border-[#333333] bg-[#f9f9f9]">
              <span className="flex items-center gap-1 cursor-pointer hover:underline cursor-pointer font-bold">
                {post._count?.likes > 0 && `Like (${post._count.likes})`}
              </span>
              <Link to={`/post/${post.id}`} className="hover:underline font-bold">
                {post._count?.comments > 0 && `Comment (${post._count.comments})`}
              </Link>
            </div>
            
            <div className="flex px-1 py-1 gap-1 bg-white">
              <button 
                onClick={() => handleLike(post.id)} 
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold transition border border-transparent ${
                  post.isLikedByMe ? "bg-black text-white hover:bg-gray-800" : "bg-[#f0f0f0] text-black border-[#333333] hover:bg-[#e0e0e0]"
                }`}
              >
                {post.isLikedByMe ? "Liked" : "Like"}
              </button>
              <Link 
                to={`/post/${post.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-[#f0f0f0] border border-[#333333] text-black text-xs font-bold hover:bg-[#e0e0e0] transition"
              >
                Comment
              </Link>
            </div>
          </Card>
        ))}

        {hasMore && (
          <button 
            type="button" 
            onClick={() => setPage((p) => p + 1)} 
            className="w-full py-2 bg-[#f0f0f0] border border-[#333333] font-bold text-black text-sm hover:bg-[#e0e0e0] transition"
          >
            Load More Posts
          </button>
        )}
        {!loading && posts.length === 0 && <p className="text-center text-black text-sm mt-10 opacity-70">No posts yet. Be the first to share something!</p>}
      </div>
    </div>
  );
};
