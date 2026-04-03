import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getPost, updatePost } from "../../../core/services/post";
import { useAuth } from "../../../core/AuthProvider";
import { useAlert } from "../../../core/AlertContext";
import { Loader } from "../../../core/components/ui/Loader";
import { Button } from "../../../core/components/ui/Button";
import { uploadImage } from "../../../core/services/upload";
import { Spinner } from "../../../core/components/ui/Spinner";

export const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const quillRef = useRef<ReactQuill>(null);

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setUploadedImages(prev => [...prev, url]);
    } catch {
      showAlert("Failed to upload image", "Error", "danger");
    } finally {
      setIsUploadingImage(false);
      e.target.value = ''; // clean up input
    }
  };

  const insertAttachedImage = (url: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection(true);
      quill.insertEmbed(range?.index || 0, "image", url);
      quill.setSelection((range?.index || 0) + 1, 0);
    }
  };

  const handleRemoveImage = (url: string) => {
    setUploadedImages(prev => prev.filter(u => u !== url));
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const imgRegex = new RegExp(`<img[^>]+src="${escapedUrl}"[^>]*>`, "gi");
    setContent(prev => prev.replace(imgRegex, ""));
  };

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

        // Extract existing images specifically for the visual attachments manager
        const matches = Array.from(post.content.matchAll(/<img[^>]+src="([^">]+)"/gi) as IterableIterator<RegExpMatchArray>);
        const urls = matches.map((match) => match[1]);
        setUploadedImages(urls);

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

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const url = await uploadImage(file);
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range?.index || 0, "image", url);
            quill.setSelection((range?.index || 0) + 1, 0);
          }
        } catch (error) {
          showAlert("Failed to upload image", "Error", "danger");
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

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
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-full border-none"
              placeholder="Start writing..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-1">Attached Images</label>
          <div className="flex gap-2 flex-wrap mt-2 mb-4">
            {uploadedImages.map((url, i) => (
              <div key={i} className="relative w-24 h-24 border border-[#333333] group bg-[#f0f0f0]">
                <img src={url} className="w-full h-full object-cover" alt="attachment" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow"
                >
                  &times;
                </button>
                <button
                  type="button"
                  onClick={() => insertAttachedImage(url)}
                  className="absolute bottom-1 left-1 right-1 bg-black text-white py-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition shadow"
                >
                  Insert
                </button>
              </div>
            ))}

            {isUploadingImage && (
              <div className="w-24 h-24 border border-[#333333] bg-gray-200 animate-pulse flex flex-col items-center justify-center gap-1">
                <Spinner size="sm" />
                <span className="text-[10px] font-bold text-black tracking-wider">UPLOADING</span>
              </div>
            )}

            <label className="w-24 h-24 border border-[#333333] border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-[#f9f9f9] transition">
              <span className="text-xl font-bold">+</span>
              <span className="text-[10px] font-bold text-black">IMAGE</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleDirectUpload} disabled={isUploadingImage} />
            </label>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            disabled={loading || !title.trim() || !content.trim() || isUploadingImage}
            isLoading={loading}
          >
            {loading ? "Updating..." : "Update Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};
