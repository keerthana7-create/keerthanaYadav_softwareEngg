import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AppDispatch, RootState } from "@/store";
import {
  fetchPostById,
  toggleLike,
  toggleBookmark,
  addComment,
} from "@/features/posts/postsSlice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((s: RootState) =>
    s.posts.items.find((p) => p.id === id),
  );
  const [comment, setComment] = useState("");
  const userId = localStorage.getItem("user_id") || "u1";

  useEffect(() => {
    if (!post && id) dispatch(fetchPostById(id));
  }, [id, post, dispatch]);

  if (!id) return null;

  const isLiked = !!post?.likes?.includes(userId);
  const isBookmarked = !!post?.bookmarks?.includes(userId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        {!post ? (
          <div className="grid place-items-center py-20 text-muted-foreground">
            Loading…
          </div>
        ) : (
          <article className="mx-auto max-w-3xl">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:underline">
                Home
              </Link>{" "}
              / <span>{post.title}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {post.title}
            </h1>
            <div className="mt-2 text-sm text-muted-foreground flex items-center justify-between">
              <span>By {post.authorName}</span>
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => dispatch(toggleLike(id))}
                className={`rounded-md border px-3 py-1.5 text-sm ${isLiked ? "bg-primary text-primary-foreground" : ""}`}
              >
                ❤ {post.likes.length}
              </button>
              <button
                onClick={() => dispatch(toggleBookmark(id))}
                className={`rounded-md border px-3 py-1.5 text-sm ${isBookmarked ? "bg-secondary" : ""}`}
              >
                🔖 {post.bookmarks.length}
              </button>
            </div>

            {post.imageUrl && (
              <img src={post.imageUrl} alt="" className="mt-6 rounded-xl" />
            )}
            <div
              className="prose prose-slate dark:prose-invert mt-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <section className="mt-10">
              <h2 className="text-xl font-semibold mb-3">
                Comments ({post.comments.length})
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment"
                  className="flex-1 rounded-md border px-3 py-2"
                />
                <button
                  onClick={() => {
                    if (comment.trim()) {
                      dispatch(addComment({ id, text: comment.trim() }));
                      setComment("");
                    }
                  }}
                  className="rounded-md bg-primary text-primary-foreground px-4"
                >
                  Post
                </button>
              </div>
              <ul className="space-y-3">
                {post.comments.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <img
                      src={c.userAvatar}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium">
                        {c.userName}{" "}
                        <span className="text-muted-foreground">
                          · {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{c.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
