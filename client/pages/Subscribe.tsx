import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import api from "@/utils/api";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      await api.post("/subscribe", { email });
      setStatus("Thanks for subscribing!");
      setEmail("");
    } catch (e: any) {
      setStatus(e?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-lg">
        <h1 className="text-3xl font-extrabold tracking-tight">Subscribe</h1>
        <p className="text-muted-foreground mt-2">
          Get the latest posts in your inbox.
        </p>
        <form onSubmit={onSubmit} className="mt-6 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="flex-1 rounded-md border px-3 py-2"
          />
          <button className="rounded-md bg-primary text-primary-foreground px-4 py-2">
            Subscribe
          </button>
        </form>
        {status && <p className="mt-3 text-sm">{status}</p>}
      </main>
      <Footer />
    </div>
  );
}
