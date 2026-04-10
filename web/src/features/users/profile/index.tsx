import { Link } from "react-router";
import { useAuth } from "../../../app/providers/AuthProvider";
import { Avatar } from "../../../shared/ui/Avatar";
import { usePosts } from "../../posts/feed/hook";
import { PostList } from "../../posts/feed/components/PostList";

export const Profile = () => {
  const { user } = useAuth();
  
  // Re-use logic from the shared posts module correctly!
  const { posts, loading, hasMore, handleLike, loadMore } = usePosts(user?.id);

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
            <Avatar fallback={user.username} src={user.avatarUrl} className="w-full h-full text-4xl md:text-5xl border-none shadow-[4px_4px_0_0_#333333]" />
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

      {/* Reuse PostList perfectly isolated domain component! */}
      <PostList 
        posts={posts} 
        loading={loading} 
        hasMore={hasMore} 
        onLike={handleLike} 
        onLoadMore={loadMore} 
      />
    </div>
  );
};
