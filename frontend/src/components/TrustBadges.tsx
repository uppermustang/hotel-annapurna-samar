import React from "react";

const TrustBadges: React.FC = () => {
  return (
    <section className="py-8 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center opacity-60 hover:opacity-100 transition-opacity duration-300">
          {/* Dummy Trust Badges */}
          <div className="text-center">
            <div className="h-12 w-24 mx-auto bg-gradient-to-r from-gray-300 to-gray-400 rounded flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-white">TripAdvisor</span>
            </div>
            <p className="text-xs text-gray-600">Excellence Award</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-24 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-white">Booking.com</span>
            </div>
            <p className="text-xs text-gray-600">Guest Favorite</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-24 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-white">Eco Cert</span>
            </div>
            <p className="text-xs text-gray-600">Sustainable Hotel</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-24 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-white">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-xs text-gray-600">5-Star Rating</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-24 mx-auto bg-gradient-to-r from-purple-400 to-purple-600 rounded flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-white">Agoda</span>
            </div>
            <p className="text-xs text-gray-600">Top Rated</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-24 mx-auto bg-gradient-to-r from-red-400 to-red-600 rounded flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-white">Himalaya</span>
            </div>
            <p className="text-xs text-gray-600">Tourism Board</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Trusted by 2,500+ guests from around the world
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
