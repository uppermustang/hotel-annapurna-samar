import React, { useState, useEffect } from "react";

const FinalCTA: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 32,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-deep-blue via-forest-green to-vibrant-pink text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white opacity-5 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full animate-bounce"></div>

        {/* Floating Icons */}
        <div className="absolute top-20 right-1/4 text-4xl animate-bounce">
          🏔️
        </div>
        <div className="absolute bottom-20 left-1/4 text-3xl animate-pulse">
          ✨
        </div>
        <div className="absolute top-1/3 right-20 text-3xl animate-ping">
          🌟
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Dream
            <span className="block text-yellow-300">Himalayan Escape</span>
            <span className="block text-2xl md:text-3xl font-normal mt-4 opacity-90">
              Awaits You!
            </span>
          </h2>

          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Don't let this once-in-a-lifetime opportunity slip away. Book now
            and create memories that will last forever in the heart of the
            Himalayas.
          </p>

          {/* Urgency Timer */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 mb-10 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-yellow-300">
              ⚡ LIMITED TIME: 25% OFF + FREE PERKS
            </h3>
            <p className="text-lg mb-6 opacity-90">Offer expires in:</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white text-vibrant-pink rounded-2xl p-4 md:p-6">
                <div className="text-3xl md:text-4xl font-bold">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-sm md:text-base">Hours</div>
              </div>
              <div className="bg-white text-vibrant-pink rounded-2xl p-4 md:p-6">
                <div className="text-3xl md:text-4xl font-bold">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-sm md:text-base">Minutes</div>
              </div>
              <div className="bg-white text-vibrant-pink rounded-2xl p-4 md:p-6">
                <div className="text-3xl md:text-4xl font-bold">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-sm md:text-base">Seconds</div>
              </div>
            </div>

            <div className="bg-yellow-400 text-gray-800 rounded-xl p-4 mb-6">
              <div className="font-bold text-lg mb-2">
                🎁 What You Get With This Offer:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>✅ 25% Off Room Rate</div>
                <div>✅ Free Airport Transfer</div>
                <div>✅ Complimentary Breakfast</div>
                <div>✅ Free WiFi & Parking</div>
                <div>✅ Welcome Drink & Snacks</div>
                <div>✅ 10% Off Spa Services</div>
              </div>
            </div>
          </div>

          {/* Main CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-10">
            <button
              className="group bg-yellow-400 text-gray-800 font-bold py-6 px-10 rounded-2xl text-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 shadow-xl"
              aria-label="Book now and save 25% on your Himalayan escape"
            >
              <span className="flex items-center">
                🚀 Book Now & Save 25%
                <svg
                  className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>

            <button
              className="bg-white bg-opacity-20 backdrop-blur-sm text-white font-bold py-6 px-10 rounded-2xl text-xl border-2 border-white transform transition-all duration-300 hover:scale-105 hover:bg-white hover:text-gray-800 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 shadow-xl"
              aria-label="Call us to book your stay"
            >
              📞 Call: +977-123-456-789
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mr-3">🔒</div>
              <div>
                <div className="font-semibold">Secure Booking</div>
                <div className="text-sm opacity-75">SSL Encrypted</div>
              </div>
            </div>

            <div className="flex items-center justify-center bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mr-3">↩️</div>
              <div>
                <div className="font-semibold">Free Cancellation</div>
                <div className="text-sm opacity-75">Up to 48hrs</div>
              </div>
            </div>

            <div className="flex items-center justify-center bg-white bg-opacity-10 rounded-xl p-4">
              <div className="text-3xl mr-3">💰</div>
              <div>
                <div className="font-semibold">Best Price</div>
                <div className="text-sm opacity-75">Guarantee</div>
              </div>
            </div>
          </div>

          {/* Final Urgency Message */}
          <div className="bg-red-600 bg-opacity-80 rounded-xl p-6 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold mb-2">
              ⚠️ Only 7 Rooms Left at This Price!
            </h4>
            <p className="text-sm opacity-90">
              This exclusive offer won't last long. Over 150 people have viewed
              this page in the last hour. Secure your mountain paradise before
              someone else does!
            </p>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-green-600 rounded-full px-6 py-3">
              <div className="text-2xl mr-3">🛡️</div>
              <div>
                <div className="font-bold">100% Money-Back Guarantee</div>
                <div className="text-sm opacity-90">
                  Not satisfied? Full refund, no questions asked
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
