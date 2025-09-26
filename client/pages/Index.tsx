import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchPosts, setPage } from "@/features/posts/postsSlice";
import PostCard from "@/components/PostCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, total, page, limit } = useSelector(
    (s: RootState) => s.posts,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get("tag"),
  );
  const q = searchParams.get("q") || undefined;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    dispatch(setPage(Number.isFinite(p) ? p : 1));
    dispatch(
      fetchPosts({ page: p, limit, search: q, tag: selectedTag || undefined }),
    );
  }, [dispatch, searchParams, q, selectedTag, limit]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 12);
  }, [items]);

  const onPageChange = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setSearchParams((prev) => {
      prev.set("page", String(clamped));
      return prev;
    });
    dispatch(setPage(clamped));
    dispatch(
      fetchPosts({
        page: clamped,
        limit,
        search: q,
        tag: selectedTag || undefined,
      }),
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <section className="mb-8 grid gap-6 md:grid-cols-[1.3fr,1fr] items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Insights, Stories, and Guides
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              A modern, responsive blog platform built with React and Redux
              Toolkit. Explore trending topics and dive into thoughtful
              articles.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="/editor"
                className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
              >
                Start Writing
              </a>
              <a href="#feed" className="rounded-md border px-4 py-2 text-sm">
                Explore
              </a>
            </div>
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fa7c06777e3d7449195ec2c3ed270e026%2F9fff7e8d28d543ac901914458ddedee2?format=webp&width=800"
            alt="Hero visual"
            className="w-full rounded-2xl border shadow-sm"
          />
        </section>

        <section className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setSelectedTag(null);
                setSearchParams((prev) => {
                  prev.delete("tag");
                  prev.set("page", "1");
                  return prev;
                });
              }}
              className={`rounded-full border px-3 py-1 text-sm ${!selectedTag ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSelectedTag(t);
                  setSearchParams((prev) => {
                    prev.set("tag", t);
                    prev.set("page", "1");
                    return prev;
                  });
                }}
                className={`rounded-full border px-3 py-1 text-sm ${selectedTag === t ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
              >
                #{t}
              </button>
            ))}
          </div>
        </section>

        {status === "loading" && (
          <div className="grid place-items-center py-20 text-muted-foreground">
            Loading posts…
          </div>
        )}
        {status === "failed" && (
          <div className="grid place-items-center py-20 text-red-600">
            Failed to load posts.
          </div>
        )}
        {status === "idle" && (
          <section id="feed">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
