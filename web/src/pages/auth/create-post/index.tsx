import { useState } from "react";
import { useNavigate, Link } from "react-router";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createPost } from "../../../core/services/post";
import { useAlert } from "../../../core/AlertContext";

export const CreatePost = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return showAlert("Title and content are required", "Validation Error", "danger");
    
    setLoading(true);
    try {
      await createPost({ title, content });
      navigate("/");
    } catch {
      showAlert("Failed to create post", "Error", "danger");
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

  return (
    <div className="bg-white border border-[#333333] p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-[#333333] pb-4">
        <h1 className="text-xl font-bold text-black">Create a Post</h1>
        <Link to="/" className="text-black hover:underline font-bold text-sm">Cancel</Link>
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
          <button 
            type="submit" 
            disabled={loading || !title.trim() || !content.trim()}
            className="bg-[#f0f0f0] border border-[#333333] text-black hover:bg-[#e0e0e0] font-bold py-1.5 px-6 disabled:opacity-50 transition text-sm"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};
