import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  createPost,
  fetchPostById,
  updatePost,
  deletePost,
} from "@/features/posts/postsSlice";

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const existing = useSelector((s: RootState) =>
    s.posts.items.find((p) => p.id === id),
  );
  const userId = localStorage.getItem("user_id") || "u1";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (id && !existing) dispatch(fetchPostById(id));
  }, [id, existing, dispatch]);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setContent(existing.content.replace(/<[^>]+>/g, ""));
      setTags(existing.tags.join(", "));
      setImageUrl(existing.imageUrl);
    }
  }, [existing]);

  const canEdit = useMemo(
    () => (existing ? existing.authorId === userId : true),
    [existing, userId],
  );

  const onFileChange = (file?: File) => {
    if (!file) return setImageUrl(undefined);
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onSave = async () => {
    const payload = {
      title: title.trim(),
      content: `<p>${content.trim()}</p>`,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrl,
      state: "published" as const,
    };
    if (!payload.title || !payload.content)
      return alert("Title and content are required");
    if (id) {
      if (!canEdit) return alert("You can only edit your own posts");
      const res = await dispatch(updatePost({ id, ...payload }));
      if ((res as any).error) return;
      navigate(`/post/${id}`);
    } else {
      const res = await dispatch(createPost(payload));
      const p = (res as any).payload;
      if (p?.id) navigate(`/post/${p.id}`);
    }
  };

  const onDelete = async () => {
    if (!id) return;
    if (!canEdit) return alert("You can only delete your own posts");
    if (!confirm("Delete this post?")) return;
    const res = await dispatch(deletePost(id));
    if ((res as any).error) return;
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">
          {id ? "Edit Post" : "New Post"}
        </h1>
        {id && !canEdit && (
          <div className="mb-4 rounded-md border bg-secondary px-3 py-2 text-sm text-secondary-foreground">
            You are not the author of this post.
          </div>
        )}
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full rounded-md border px-3 py-2"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content..."
            className="min-h-[200px] w-full rounded-md border px-3 py-2"
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full rounded-md border px-3 py-2"
          />

          <div className="rounded-md border p-3">
            <label className="text-sm font-medium">Optional image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0])}
              className="mt-2"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-3 rounded-md max-h-60 object-cover"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="rounded-md bg-primary text-primary-foreground px-4 py-2"
            >
              Save
            </button>
            {id && (
              <button
                onClick={onDelete}
                className="rounded-md border px-4 py-2"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
