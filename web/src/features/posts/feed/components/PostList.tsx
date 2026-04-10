import { PostCard } from "./PostCard";
import { PostSkeleton } from "../../../../shared/ui/PostSkeleton";

interface PostListProps {
  posts: any[];
  loading: boolean;
  hasMore: boolean;
  onLike: (postId: string) => void;
  onLoadMore: () => void;
}

export const PostList = ({ posts, loading, hasMore, onLike, onLoadMore }: PostListProps) => {
  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={onLike} />
      ))}

      {loading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}

      {hasMore && (
        <button 
          type="button" 
          onClick={onLoadMore} 
          className="w-full py-2 bg-[#f0f0f0] border border-[#333333] font-bold text-black text-sm hover:bg-[#e0e0e0] transition"
        >
          Load More Posts
        </button>
      )}
      {!loading && posts.length === 0 && (
        <p className="text-center text-black text-sm mt-10 opacity-70">
          No posts yet. Be the first to share something!
        </p>
      )}
    </div>
  );
};
