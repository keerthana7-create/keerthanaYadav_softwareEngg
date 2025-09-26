import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { register as registerThunk } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("New User");
  const [email, setEmail] = useState("new@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await dispatch(registerThunk({ name, email, password }));
    const payload: any = (res as any).payload;
    if (!payload || (res as any).error) {
      setError("Registration failed");
      return;
    }
    localStorage.setItem("user_id", payload.id);
    localStorage.setItem("user_name", payload.name);
    localStorage.setItem("user_email", payload.email);
    if (payload.avatarUrl)
      localStorage.setItem("user_avatar", payload.avatarUrl);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create Account
        </h1>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="rounded-md border px-3 py-2"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-md border px-3 py-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-md border px-3 py-2"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="rounded-md bg-primary text-primary-foreground px-4 py-2">
            Sign up
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
