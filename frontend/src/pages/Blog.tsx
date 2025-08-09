import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image?: string;
  date: string;
}

const demoPosts: BlogPost[] = [
  {
    id: 1,
    title: "Trekking Season Guide: Best Months to Visit",
    excerpt:
      "Plan the perfect trek with our season-by-season breakdown for the Annapurna region.",
    image: "",
    date: "Apr 12, 2025",
  },
  {
    id: 2,
    title: "Local Cuisine You Must Try",
    excerpt:
      "From dal bhat to momos, explore authentic flavors and where to find them.",
    image: "",
    date: "Mar 28, 2025",
  },
  {
    id: 3,
    title: "Packing List for High-Altitude Adventures",
    excerpt:
      "A minimalist but complete packing list for comfort and safety in the mountains.",
    image: "",
    date: "Mar 08, 2025",
  },
];

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <section className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-deep-blue mb-3">Blog</h1>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Stories, tips, and guides from Hotel Annapurna Samar and the Himalayas.
          </p>

        </section>
        <section className="container mx-auto px-4">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {demoPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-44 bg-gradient-to-r from-deep-blue to-forest-green">
                  {/* If you add real images, render an <img> here */}
                </div>
                <div className="p-5">
                  <div className="text-xs text-gray-500 mb-1">{post.date}</div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <button className="text-vibrant-pink font-semibold">Read more →</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
