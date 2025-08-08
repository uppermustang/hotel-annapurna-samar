import React, { useEffect, useState } from "react";

interface HeroContent {
  title: string;
  subtitle: string;
  mainDescription: string;
  tagline: string;
  callToAction: string;
  backgroundImage: string;
  benefits: { id: string; icon: string; title: string; description: string }[];
}

const fallbackImage = "/himalayas-bg.jpg";

const HeroSection: React.FC = () => {
  const [content, setContent] = useState<HeroContent | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hero");
        if (response.ok) {
          const data = await response.json();
          setContent(data && Object.keys(data).length ? data : null);
        }
      } catch {}
    };
    loadContent();
  }, []);

  const bgSrc = (() => {
    const img = content?.backgroundImage;
    if (!img) return fallbackImage;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return `http://localhost:5000${img}`;
    return img;
  })();

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50"></div>
        <img
          src={bgSrc}
          alt="Himalayan Mountains"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-shadow-strong leading-tight tracking-tight">
          <span className="block">{content?.title || "Haven"}</span>
        </h1>

        <div className="flex flex-col items-center space-y-6">
          <div className="text-lg md:text-xl font-medium text-yellow-300 tracking-wide">
            {content?.tagline ||
              "⭐ Intimate Lodge • Authentic Experience • Stunning Views"}
          </div>
          <div className="h-px w-24 bg-white opacity-30"></div>
          <p className="text-lg md:text-xl text-white opacity-80 max-w-lg text-center">
            {content?.callToAction ||
              "Join us for an unforgettable stay in one of our carefully curated rooms"}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {(content?.benefits?.length
            ? content.benefits
            : [
                {
                  id: "views",
                  icon: "🏔️",
                  title: "22,000+ ft Views",
                  description:
                    "Breathtaking mountain views exceeding 22,000 feet in elevation",
                },
                {
                  id: "nature",
                  icon: "🌿",
                  title: "Natural Paradise",
                  description:
                    "Towering trees, serene creek, and cascading waterfalls",
                },
                {
                  id: "cuisine",
                  icon: "🍽️",
                  title: "Local Cuisine",
                  description:
                    "Great local food and other varieties with warm hospitality",
                },
              ]
          ).map((b) => (
            <div
              key={b.id}
              className="bg-black/30 backdrop-blur-sm rounded-lg p-6 transform transition-all duration-500 hover:scale-105"
            >
              <div className="text-4xl mb-4">{b.icon}</div>
              <h4 className="font-bold text-xl mb-2">{b.title}</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
