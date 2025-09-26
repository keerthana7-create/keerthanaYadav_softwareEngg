import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getAuthor,
  toggleLike,
  toggleBookmark,
  addComment,
  getTags,
  subscribe,
} from "./routes/posts";
import {
  register as authRegister,
  login as authLogin,
  refresh as authRefresh,
  logout as authLogout,
  me as authMe,
} from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth API (mock)
  app.post("/api/auth/register", authRegister);
  app.post("/api/auth/login", authLogin);
  app.post("/api/auth/refresh", authRefresh);
  app.post("/api/auth/logout", authLogout);
  app.get("/api/auth/me", authMe);

  // Blog API
  app.get("/api/posts", listPosts);
  app.get("/api/posts/:id", getPost);
  app.post("/api/posts", createPost);
  app.put("/api/posts/:id", updatePost);
  app.delete("/api/posts/:id", deletePost);
  app.post("/api/posts/:id/like", toggleLike);
  app.post("/api/posts/:id/bookmark", toggleBookmark);
  app.post("/api/posts/:id/comments", addComment);
  app.get("/api/tags", getTags);
  app.post("/api/subscribe", subscribe);
  app.get("/api/authors/:id", getAuthor);

  return app;
}
