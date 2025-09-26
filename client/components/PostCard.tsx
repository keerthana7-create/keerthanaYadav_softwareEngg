import { Link } from "react-router-dom";
import { Post, toggleLike, toggleBookmark } from "@/features/posts/postsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

export default function PostCard({ post }: { post: Post }) {
  const dispatch = useDispatch<AppDispatch>();
  const date = new Date(post.createdAt).toLocaleDateString();
  const excerpt =
    post.content.replace(/<[^>]+>/g, "").slice(0, 160) +
    (post.content.length > 160 ? "…" : "");
  const me = localStorage.getItem("user_id") || "u1";

  return (
    <article className="group overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md">
      {post.imageUrl ? (
        <img src={post.imageUrl} alt="" className="h-48 w-full object-cover" />
      ) : (
        <div className="h-48 w-full bg-gradient-to-br from-primary/10 to-primary/20" />
      )}
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
            >
              #{t}
            </span>
          ))}
        </div>
        <Link
          to={`/post/${post.id}`}
          className="text-lg font-semibold leading-tight tracking-tight group-hover:underline"
        >
          {post.title}
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">{excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>By {post.authorName}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleLike(post.id))}
              className={`rounded-full border px-2 py-1 ${post.likes?.includes(me) ? "bg-primary text-primary-foreground" : ""}`}
              aria-label="Like"
            >
              ❤ {post.likes?.length ?? 0}
            </button>
            <button
              onClick={() => dispatch(toggleBookmark(post.id))}
              className={`rounded-full border px-2 py-1 ${post.bookmarks?.includes(me) ? "bg-primary text-primary-foreground" : ""}`}
              aria-label="Bookmark"
            >
              🔖 {post.bookmarks?.length ?? 0}
            </button>
            <time dateTime={post.createdAt}>{date}</time>
          </div>
        </div>
        {post.authorId === me && (
          <div className="mt-3">
            <Link to={`/editor/${post.id}`} className="text-xs underline">
              Edit
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
