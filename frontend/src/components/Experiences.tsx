import React, { useEffect, useState } from "react";

const Experiences: React.FC = () => {
  const [title, setTitle] = useState<string | null>(null);
  const [items, setItems] = useState<
    Array<{ title: string; description: string; image?: string }>
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/home");
        if (res.ok) {
          const data = await res.json();
          setTitle(data?.experiences?.title || null);
          setItems(
            Array.isArray(data?.experiences?.items)
              ? data.experiences.items
              : []
          );
        }
      } catch {}
    })();
  }, []);

  return (
    <section id="experiences" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-deep-blue">
          {title || "Unique Experiences"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(items.length > 0
            ? items
            : [
                {
                  title: "Mountain Trekking",
                  description:
                    "Guided treks through the beautiful Annapurna region with breathtaking views and cultural encounters.",
                },
                {
                  title: "Cultural Tours",
                  description:
                    "Explore local villages, monasteries, and experience the rich cultural heritage of the Himalayas.",
                },
                {
                  title: "Spa & Wellness",
                  description:
                    "Rejuvenate your body and mind with traditional healing therapies and modern wellness treatments.",
                },
                {
                  title: "Adventure Sports",
                  description:
                    "Paragliding, white water rafting, and other thrilling activities for adventure enthusiasts.",
                },
                {
                  title: "Photography Tours",
                  description:
                    "Capture stunning landscapes and wildlife with our expert photography guides.",
                },
                {
                  title: "Yoga & Meditation",
                  description:
                    "Find inner peace with our yoga sessions and meditation retreats in serene mountain settings.",
                },
              ]
          ).map((it, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {it.image ? (
                <img
                  src={
                    it.image.startsWith("http")
                      ? it.image
                      : `http://localhost:5000${it.image}`
                  }
                  alt={it.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="h-48 bg-gradient-to-r from-deep-blue to-forest-green" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{it.title}</h3>
                <p className="text-gray-600">{it.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
