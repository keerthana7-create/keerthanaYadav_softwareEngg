import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import api from "@/utils/api";

interface TagItem {
  tag: string;
  count: number;
}

export default function Categories() {
  const [tags, setTags] = useState<TagItem[]>([]);
  useEffect(() => {
    api.get("/tags").then(({ data }) => setTags(data.items));
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Categories</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tags.map((t) => (
            <a
              key={t.tag}
              href={`/?tag=${encodeURIComponent(t.tag)}`}
              className="rounded-xl border p-5 hover:bg-accent"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">#{t.tag}</span>
                <span className="text-sm text-muted-foreground">{t.count}</span>
              </div>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
