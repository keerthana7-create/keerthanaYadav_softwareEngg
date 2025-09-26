import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchPosts } from "@/features/posts/postsSlice";
import PostCard from "@/components/PostCard";

export default function Bookmarks() {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((s: RootState) => s.posts);
  const me = localStorage.getItem("user_id") || "u1";

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 100 }));
  }, [dispatch]);

  const list = items.filter((p) => p.bookmarks?.includes(me));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Bookmarked Blogs
        </h1>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          {list.length === 0 && (
            <p className="text-muted-foreground">No bookmarks yet.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
