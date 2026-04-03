import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getPost, updatePost } from "../../../core/services/post";
import { useAuth } from "../../../core/AuthProvider";
import { useAlert } from "../../../core/AlertContext";
import { Loader } from "../../../core/components/ui/Loader";
import { Button } from "../../../core/components/ui/Button";

export const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const post = await getPost(id);
        if (post.userId !== user?.id) {
          showAlert("You are not authorized to edit this post", "Error", "danger");
          return navigate("/");
        }
        setTitle(post.title);
        setContent(post.content);
      } catch {
        showAlert("Failed to load post", "Error", "danger");
        navigate("/");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !id) return showAlert("Title and content are required", "Validation Error", "danger");
    
    setLoading(true);
    try {
      await updatePost(id, { title, content });
      navigate(`/post/${id}`);
    } catch {
      showAlert("Failed to update post", "Error", "danger");
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  if (initialLoading) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="bg-white border border-[#333333] p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-[#333333] pb-4">
        <h1 className="text-xl font-bold text-black">Edit Post</h1>
        <Link to={`/post/${id}`} className="text-black hover:underline font-bold text-sm">Cancel</Link>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-1">Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#333333] px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-[#333333]"
            placeholder="What's on your mind?"
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-black mb-1">Content</label>
          <div className="bg-white border border-[#333333] h-64 overflow-hidden focus-within:ring-1 focus-within:ring-[#333333]">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              className="h-full border-none"
              placeholder="Start writing..."
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            type="submit" 
            disabled={loading || !title.trim() || !content.trim()}
            isLoading={loading}
          >
            {loading ? "Updating..." : "Update Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};
