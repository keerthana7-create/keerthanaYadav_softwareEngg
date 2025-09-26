import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight">Contact</h1>
        <p className="text-muted-foreground mt-2">
          We'd love to hear from you.
        </p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="rounded-md border px-3 py-2"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="rounded-md border px-3 py-2"
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Message"
            className="min-h-[160px] rounded-md border px-3 py-2"
          />
          <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 w-fit">
            Send
          </button>
        </form>
        {sent && <p className="mt-3 text-sm">Thanks! We'll get back soon.</p>}
      </main>
      <Footer />
    </div>
  );
}
