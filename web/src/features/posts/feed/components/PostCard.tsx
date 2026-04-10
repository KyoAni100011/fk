import { Link } from "react-router";
import DOMPurify from "dompurify";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../../../../shared/ui/Avatar";
import { Card } from "../../../../shared/ui/Card";

interface PostCardProps {
  post: any;
  onLike: (postId: string) => void;
}

export const PostCard = ({ post, onLike }: PostCardProps) => {
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar fallback={post.user.username} src={post.user.avatarUrl} />
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
          onClick={() => onLike(post.id)} 
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
  );
};
