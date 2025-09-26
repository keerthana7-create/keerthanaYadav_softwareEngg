import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchPosts } from "@/features/posts/postsSlice";
import PostCard from "@/components/PostCard";

interface AuthorResponse {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  postsCount: number;
}

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<AuthorResponse | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((s: RootState) =>
    s.posts.items.filter((p) => p.authorId === id),
  );

  useEffect(() => {
    if (!id) return;
    api.get(`/authors/${id}`).then(({ data }) => setAuthor(data));
    dispatch(fetchPosts({ page: 1, limit: 50, author: id }));
  }, [id, dispatch]);

  const displayName = useMemo(() => author?.name || "User", [author]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <section className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <img
              className="h-16 w-16 rounded-full"
              src={author?.avatarUrl || "https://i.pravatar.cc/80"}
              alt=""
            />
            <div>
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-muted-foreground">{author?.bio || ""}</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Posts by {displayName}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
