import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50"></div>
        <img
          src="/himalayas-bg.jpg"
          alt="Himalayan Mountains"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-shadow-strong leading-tight tracking-tight">
          A Mountain
          <span className="block">Haven</span>
        </h1>

        <div className="flex flex-col items-center space-y-6">
          <div className="text-lg md:text-xl font-medium text-yellow-300 tracking-wide">
            ⭐ Intimate Lodge • Authentic Experience • Stunning Views
          </div>
          <div className="h-px w-24 bg-white opacity-30"></div>
          <p className="text-lg md:text-xl text-white opacity-80 max-w-lg text-center">
            Join us for an unforgettable stay in one of our carefully curated
            rooms
          </p>
        </div>

        {/* Quick Benefits */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 transform transition-all duration-500 hover:scale-105">
            <div className="text-4xl mb-4">🏔️</div>
            <h4 className="font-bold text-xl mb-2">22,000+ ft Views</h4>
            <p className="text-sm opacity-90 leading-relaxed">
              Breathtaking mountain views exceeding 22,000 feet in elevation
            </p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 transform transition-all duration-500 hover:scale-105">
            <div className="text-4xl mb-4">🌿</div>
            <h4 className="font-bold text-xl mb-2">Natural Paradise</h4>
            <p className="text-sm opacity-90 leading-relaxed">
              Towering trees, serene creek, and cascading waterfalls
            </p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 transform transition-all duration-500 hover:scale-105">
            <div className="text-4xl mb-4">🍽️</div>
            <h4 className="font-bold text-xl mb-2">Local Cuisine</h4>
            <p className="text-sm opacity-90 leading-relaxed">
              Great local food and other varieties with warm hospitality
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
