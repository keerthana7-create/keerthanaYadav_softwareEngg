import { RequestHandler } from "express";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

const users: Record<string, User & { password: string }> = {
  u1: {
    id: "u1",
    name: "Alex Rivera",
    email: "alex@example.com",
    avatarUrl: "https://i.pravatar.cc/80?img=1",
    password: "password",
  },
};

function token(user: User) {
  return Buffer.from(`${user.id}:${Date.now()}`).toString("base64");
}

export const register: RequestHandler = (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ message: "name, email, password required" });
  const id = `u${Date.now()}`;
  const user: User = {
    id,
    name,
    email,
    avatarUrl: `https://i.pravatar.cc/80?u=${encodeURIComponent(email)}`,
  };
  users[id] = { ...user, password };
  res.json({ accessToken: token(user), user });
};

export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body || {};
  const found = Object.values(users).find((u) => u.email === email);
  if (!found || found.password !== password)
    return res.status(401).json({ message: "Invalid credentials" });
  const { password: _pw, ...user } = found;
  res.json({ accessToken: token(user), user });
};

export const refresh: RequestHandler = (_req, res) => {
  res.json({
    accessToken: token({
      id: "u1",
      name: "Alex Rivera",
      email: "alex@example.com",
    }),
  });
};

export const logout: RequestHandler = (_req, res) => res.json({ ok: true });

export const me: RequestHandler = (req, res) => {
  const id = String(req.headers["x-user-id"] || "u1");
  const u = users[id];
  if (!u) return res.status(404).json({ message: "Not found" });
  const { password: _pw, ...user } = u;
  res.json(user);
};
