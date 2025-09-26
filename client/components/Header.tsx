import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchPosts, setPage } from "@/features/posts/postsSlice";
import { FormEvent, useState } from "react";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      if (q) prev.set("q", q);
      else prev.delete("q");
      prev.set("page", "1");
      return prev;
    });
    dispatch(setPage(1));
    dispatch(fetchPosts({ page: 1, search: q }));
    if (location.pathname !== "/") navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold text-xl tracking-tight"
        >
          <span className="inline-block h-6 w-6 rounded bg-primary"></span>
          Blog-Daily Drift
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/categories" className="hover:underline">
            Categories
          </Link>
          <Link to="/bookmarks" className="hover:underline">
            Bookmarked
          </Link>
          <Link
            to={`/profile/${localStorage.getItem("user_id") || "u1"}`}
            className="hover:underline"
          >
            My Profile
          </Link>
          <Link to="/subscribe" className="hover:underline">
            Subscribe
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </nav>
        <form
          onSubmit={onSubmit}
          className="hidden md:flex items-center gap-2 w-full max-w-md"
        >
          <input
            aria-label="Search posts"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles, tags, authors..."
            className="w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition">
            Search
          </button>
        </form>
        <div className="flex items-center gap-3">
          <Link
            to="/editor"
            className="hidden sm:inline-flex rounded-md border px-3 py-2 text-sm hover:bg-accent"
          >
            New Post
          </Link>
          <ThemeToggle />
          <div className="md:hidden">
            <details>
              <summary className="list-none cursor-pointer rounded-md border px-3 py-2 text-sm">
                Menu
              </summary>
              <div className="absolute right-4 mt-2 w-56 rounded-md border bg-background p-2 shadow-md flex flex-col gap-1 text-sm">
                <Link to="/" className="px-2 py-1 rounded hover:bg-accent">
                  Home
                </Link>
                <Link
                  to="/categories"
                  className="px-2 py-1 rounded hover:bg-accent"
                >
                  Categories
                </Link>
                <Link
                  to="/bookmarks"
                  className="px-2 py-1 rounded hover:bg-accent"
                >
                  Bookmarked
                </Link>
                <Link
                  to={`/profile/${localStorage.getItem("user_id") || "u1"}`}
                  className="px-2 py-1 rounded hover:bg-accent"
                >
                  My Profile
                </Link>
                <Link
                  to="/subscribe"
                  className="px-2 py-1 rounded hover:bg-accent"
                >
                  Subscribe
                </Link>
                <Link
                  to="/contact"
                  className="px-2 py-1 rounded hover:bg-accent"
                >
                  Contact
                </Link>
                <Link
                  to="/editor"
                  className="px-2 py-1 rounded hover:bg-accent"
                >
                  New Post
                </Link>
                <Link to="/login" className="px-2 py-1 rounded hover:bg-accent">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-2 py-1 rounded hover:bg-accent"
                >
                  Register
                </Link>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
