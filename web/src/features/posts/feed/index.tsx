import { useNavigate } from "react-router";
import { Avatar } from "../../../shared/ui/Avatar";
import { Card } from "../../../shared/ui/Card";
import { useAuth } from "../../../app/providers/AuthProvider";
import { usePosts } from "./hook";
import { PostList } from "./components/PostList";

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // All fetching and state logic has been completely abstracted!
  const { posts, loading, hasMore, handleLike, loadMore } = usePosts();

  return (
    <div className="w-full flex flex-col gap-6 max-w-2xl mx-auto pb-10">
      <Card 
        className="p-3 flex gap-3 items-center cursor-pointer hover:bg-[#f9f9f9] transition"
        onClick={() => navigate("/create-post")}
      >
        <Avatar fallback={user?.username || "?"} src={user?.avatarUrl} />
        <div className="flex-1 bg-white border border-[#333333] py-1.5 px-3 text-black text-sm hover:bg-[#f0f0f0] transition">
          What's on your mind, {user?.username}?
        </div>
      </Card>

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
