import React, { useEffect, useMemo, useState } from "react";
import { useClientManagement } from "../hooks/useClientManagement";
import { FaCrown, FaUser, FaStar, FaCalendarAlt, FaHeart } from "react-icons/fa";

interface HeroContent {
  title: string;
  subtitle: string;
  mainDescription: string;
  tagline: string;
  callToAction: string;
  backgroundImage: string;
  benefits: { id: string; icon: string; title: string; description: string }[];
}

type HeroBackground = {
  type: "image" | "video" | "youtube";
  src: string;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
};

const fallbackImage = "/himalayas-bg.jpg";

const HeroSection: React.FC = () => {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [heroBg, setHeroBg] = useState<HeroBackground>({
    type: "image",
    src: fallbackImage,
    loop: true,
  });

  // Client Management Integration
  const { guests: clientGuests, getGuestsForHero } = useClientManagement();

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/home");
        if (response.ok) {
          const data = await response.json();
          if (data?.heroBackground) setHeroBg(data.heroBackground);
        }
      } catch {}

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

  // Get VIP guests for hero section
  const vipGuests = useMemo(() => {
    return clientGuests
      .filter(guest => guest.loyaltyPoints && guest.loyaltyPoints > 1000)
      .sort((a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0))
      .slice(0, 3);
  }, [clientGuests]);

  // Get recent guest activity
  const recentActivity = useMemo(() => {
    return clientGuests
      .filter(guest => guest.lastVisit)
      .sort((a, b) => new Date(b.lastVisit!).getTime() - new Date(a.lastVisit!).getTime())
      .slice(0, 2);
  }, [clientGuests]);

  const normalizedSrc = useMemo(() => {
    const src = heroBg.src || content?.backgroundImage || fallbackImage;
    if (src.startsWith("http")) return src;
    if (src.startsWith("/uploads")) return `http://localhost:5000${src}`;
    return src;
  }, [heroBg.src, content?.backgroundImage]);

  const posterSrc = useMemo(() => {
    const p = heroBg.poster;
    if (!p) return undefined;
    if (p.startsWith("http")) return p;
    if (p.startsWith("/uploads")) return `http://localhost:5000${p}`;
    return p;
  }, [heroBg.poster]);

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/45" />

        {heroBg.type === "video" && normalizedSrc ? (
          <video
            className="absolute inset-0 w-[105vw] h-[105vh] -left-[2.5vw] -top-[2.5vh] object-cover"
            src={normalizedSrc}
            autoPlay
            muted={heroBg.muted ?? true}
            playsInline
            loop={heroBg.loop ?? true}
            poster={posterSrc}
          />
        ) : heroBg.type === "youtube" && normalizedSrc ? (
          <iframe
            className="absolute inset-0 w-[120vw] h-[120vh] -left-[10vw] -top-[10vh]"
            src={`${normalizedSrc.replace(
              "watch?v=",
              "embed/"
            )}?autoplay=1&mute=${heroBg.muted ? 1 : 0}&loop=${
              heroBg.loop ? 1 : 0
            }&playlist=${normalizedSrc.split("v=")[1] || ""}`}
            title="Hero Background"
            frameBorder={0}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            src={normalizedSrc}
            alt="Hero"
            className="absolute inset-0 w-[105vw] h-[105vh] -left-[2.5vw] -top-[2.5vh] object-cover"
          />
        )}
      </div>

      {/* VIP Guests Overlay */}
      {vipGuests.length > 0 && (
        <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-xs">
          <div className="flex items-center mb-2">
            <FaCrown className="text-yellow-400 mr-2" />
            <h3 className="text-sm font-semibold">VIP Guests</h3>
          </div>
          <div className="space-y-2">
            {vipGuests.map((guest) => (
              <div key={guest._id} className="flex items-center text-xs">
                <FaUser className="text-blue-300 mr-2" />
                <span className="truncate">{guest.name}</span>
                <span className="ml-auto text-yellow-400 font-bold">
                  {guest.loyaltyPoints} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Overlay */}
      {recentActivity.length > 0 && (
        <div className="absolute bottom-4 left-4 z-20 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-xs">
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-blue-300 mr-2" />
            <h3 className="text-sm font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-2">
            {recentActivity.map((guest) => (
              <div key={guest._id} className="text-xs">
                <div className="flex items-center">
                  <FaHeart className="text-red-300 mr-2" />
                  <span className="truncate">{guest.name}</span>
                </div>
                <div className="text-gray-300 ml-4">
                  Last visit: {guest.lastVisit ? new Date(guest.lastVisit).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {content ? (
          <>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {content.title}
            </h1>
            {content.subtitle && (
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                {content.subtitle}
              </p>
            )}
            <p className="text-lg md:text-xl mb-8 opacity-80 leading-relaxed">
              {content.mainDescription}
            </p>
            <p className="text-lg mb-8 opacity-90 font-medium">
              {content.tagline}
            </p>
            <button className="bg-white text-deep-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              {content.callToAction}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              A Mountain Haven
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-80 leading-relaxed">
              Towering trees, a serene creek flowing through the heart of our lodge, cascading waterfalls, tranquil seclusion, and breathtaking mountain views exceeding 22,000 feet. The first and oldest lodge in the village, offering great local food and other varieties, with warm hospitality.
            </p>
            <p className="text-lg mb-8 opacity-90 font-medium">
              ⭐ Intimate Lodge • Authentic Experience • Stunning Views
            </p>
            <button className="bg-white text-deep-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Join us for an unforgettable stay in one of our carefully curated rooms
            </button>
          </>
        )}

        {/* Benefits Section */}
        {content?.benefits && content.benefits.length > 0 && (
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {content.benefits.map((benefit) => (
              <div key={benefit.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm opacity-80">{benefit.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
