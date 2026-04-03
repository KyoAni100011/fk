import { useEffect, useState } from "react";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import { useAuth } from "../../../core/AuthProvider";
import { getPosts } from "../../../core/services/post";
import { toggleLike } from "../../../core/services/like";
import { useAlert } from "../../../core/AlertContext";

import { PostSkeleton } from "../../../core/components/ui/PostSkeleton";

export const Profile = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMyPosts = async () => {
      try {
        const res = await getPosts(1, 50, user.id);
        setPosts(res.data);
      } catch {
        showAlert("Failed to load your posts", "Error", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [user]);

  const handleLike = async (postId: string) => {
    try {
      const result = await toggleLike(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, isLikedByMe: result.isLiked, _count: { ...p._count, likes: result.likeCount } }
            : p
        )
      );
    } catch {
      showAlert("Failed to toggle like", "Error", "danger");
    }
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-2xl mx-auto pb-10 pt-4">
      
      {/* Cover Photo Area */}
      <div className="w-full bg-[#f0f0f0] h-32 md:h-48 border border-[#333333] border-b-0">
      </div>

      {/* Profile Header Info */}
      <div className="bg-white border border-[#333333] px-4 md:px-6 pb-6 mb-6">
        <div className="flex justify-between items-start">
          {/* Avatar overlapping the cover */}
          <div className="w-24 h-24 md:w-32 md:h-32 border-[4px] border-white bg-white -mt-12 md:-mt-16 z-10 relative">
            <div className="w-full h-full border border-[#333333] bg-[#f0f0f0] flex items-center justify-center font-bold text-black text-4xl md:text-5xl shadow-[4px_4px_0_0_#333333]">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="mt-4">
            <Link 
              to="/settings" 
              className="uppercase tracking-widest text-xs font-bold px-6 py-2 border border-[#333333] bg-white text-black hover:bg-[#f0f0f0] transition shadow-[2px_2px_0_0_#333333]"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-black text-black tracking-tight">{user.username}</h2>
          <p className="text-sm font-bold text-black opacity-60">@{user.username}</p>
          
          <p className="mt-4 text-sm font-medium text-black">
            Papana Member
          </p>

          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="font-bold text-black">{posts.length}</span> 
              <span className="text-black opacity-70 ml-1">Posts</span>
            </div>
            <div>
              <span className="font-bold text-black">
                {posts.reduce((acc, p) => acc + (p._count?.likes || 0), 0)}
              </span> 
              <span className="text-black opacity-70 ml-1">Likes received</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#333333] mb-6">
        <div className="px-2 py-3 mr-6 font-bold border-b-[3px] border-black text-black uppercase tracking-wider text-sm">
          My Posts
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.length === 0 ? (
            <div className="bg-[#f0f0f0] border border-[#333333] p-10 text-center font-bold text-sm text-black">
              NO POSTS FOUND. START WRITING!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white border border-[#333333]">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 border border-[#333333] bg-[#f0f0f0] flex items-center justify-center font-bold text-black text-xs">
                      {post.user.username.charAt(0).toUpperCase()}
                    </div>
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
                  <span className="flex items-center gap-1 font-bold">
                    {post._count?.likes > 0 && `Like (${post._count.likes})`}
                  </span>
                  <Link to={`/post/${post.id}`} className="hover:underline font-bold">
                    {post._count?.comments > 0 && `Comment (${post._count.comments})`}
                  </Link>
                </div>

                <div className="flex px-1 py-1 gap-1 bg-white">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold transition border border-transparent ${post.isLikedByMe ? "bg-black text-white hover:bg-gray-800" : "bg-[#f0f0f0] text-black border-[#333333] hover:bg-[#e0e0e0]"
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
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
