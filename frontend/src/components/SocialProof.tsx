import React, { useState, useEffect } from "react";

const SocialProof: React.FC = () => {
  const [visibleNotification, setVisibleNotification] = useState(0);

  const recentBookings = [
    { name: "Sarah from USA", room: "Deluxe Suite", time: "2 minutes ago" },
    {
      name: "David from UK",
      room: "Presidential Suite",
      time: "5 minutes ago",
    },
    { name: "Maria from Spain", room: "Mountain View", time: "8 minutes ago" },
    {
      name: "Chen from Singapore",
      room: "Executive Suite",
      time: "12 minutes ago",
    },
    { name: "Ahmed from UAE", room: "Deluxe Room", time: "15 minutes ago" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleNotification((prev) => (prev + 1) % recentBookings.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [recentBookings.length]);

  return (
    <section className="py-16 bg-gray-50 relative">
      {/* Live Booking Notification */}
      <div className="fixed bottom-6 left-6 z-50 max-w-sm">
        <div className="bg-white border-l-4 border-green-500 shadow-lg rounded-lg p-4 transform transition-all duration-500 hover:scale-105">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {recentBookings[visibleNotification].name}
              </p>
              <p className="text-xs text-gray-600">
                just booked {recentBookings[visibleNotification].room}
              </p>
              <p className="text-xs text-green-600">
                {recentBookings[visibleNotification].time}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep-blue mb-4">
            Join 2,500+ Happy Guests
          </h2>
          <p className="text-xl text-gray-600">
            See what our guests are saying about their unforgettable experiences
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-vibrant-pink mb-2">
                4.9/5
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-forest-green mb-2">
                2,500+
              </div>
              <div className="text-sm text-gray-600">Happy Guests</div>
              <div className="text-green-500 text-lg">😊</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-warm-red mb-2">98%</div>
              <div className="text-sm text-gray-600">Would Recommend</div>
              <div className="text-red-500 text-lg">👍</div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-deep-blue mb-2">5</div>
              <div className="text-sm text-gray-600">Years Excellence</div>
              <div className="text-blue-500 text-lg">🏆</div>
            </div>
          </div>
        </div>

        {/* Recent Reviews Carousel */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-center mb-8 text-deep-blue">
            Latest Reviews from Real Guests
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-vibrant-pink pl-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-vibrant-pink to-warm-red rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-3">
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">2 days ago</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 text-sm">
                "Absolutely breathtaking views! The service was exceptional and
                the room was spotless. Can't wait to come back next year!"
              </p>
            </div>

            <div className="border-l-4 border-forest-green pl-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-forest-green to-deep-blue rounded-full flex items-center justify-center text-white font-bold">
                  D
                </div>
                <div className="ml-3">
                  <div className="font-semibold">David Chen</div>
                  <div className="text-sm text-gray-500">1 week ago</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 text-sm">
                "Perfect location for trekking adventures. Staff went above and
                beyond to arrange our Annapurna circuit trek. Highly
                recommended!"
              </p>
            </div>

            <div className="border-l-4 border-warm-red pl-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-warm-red to-vibrant-pink rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-3">
                  <div className="font-semibold">Maria Rodriguez</div>
                  <div className="text-sm text-gray-500">2 weeks ago</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 text-sm">
                "The traditional Nepali cuisine was incredible! Every meal was a
                culinary adventure. The spa treatments were also amazing."
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <button className="text-vibrant-pink font-semibold hover:underline">
              Read All 1,247 Reviews →
            </button>
          </div>
        </div>

        {/* Social Media Proof */}
        <div className="mt-12 text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Follow our journey on social media
          </h4>
          <div className="flex justify-center space-x-6">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <span className="text-sm font-bold">12K Followers</span>
            </div>
            <div className="bg-pink-600 text-white p-3 rounded-full">
              <span className="text-sm font-bold">8K Likes</span>
            </div>
            <div className="bg-red-600 text-white p-3 rounded-full">
              <span className="text-sm font-bold">5K Subscribers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
