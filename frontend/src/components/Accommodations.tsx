import React, { useState } from "react";

const Accommodations: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  const rooms = [
    {
      id: 1,
      name: "Standard Mountain View",
      originalPrice: 132,
      discountedPrice: 99,
      savings: 33,
      image: "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800",
      features: [
        "Mountain View",
        "Free WiFi",
        "Mini Bar",
        "Room Service",
        '32" Smart TV',
      ],
      description:
        "Comfortable rooms with modern amenities and beautiful mountain views perfect for couples and solo travelers.",
      size: "25 sqm",
      capacity: "2 guests",
      popular: false,
    },
    {
      id: 2,
      name: "Deluxe Himalayan Suite",
      originalPrice: 199,
      discountedPrice: 149,
      savings: 50,
      image: "bg-gradient-to-br from-green-400 via-green-600 to-green-800",
      features: [
        "Panoramic Views",
        "Private Balcony",
        "Luxury Amenities",
        "Butler Service",
        "Spa Access",
      ],
      description:
        "Spacious rooms with premium amenities and panoramic Himalayan views. Perfect for romantic getaways.",
      size: "35 sqm",
      capacity: "3 guests",
      popular: true,
    },
    {
      id: 3,
      name: "Presidential Mountain Palace",
      originalPrice: 399,
      discountedPrice: 299,
      savings: 100,
      image: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500",
      features: [
        "Private Terrace",
        "Exclusive Views",
        "Premium Dining",
        "Personal Concierge",
        "VIP Airport Transfer",
      ],
      description:
        "Luxurious suite with private balcony and exclusive mountain vistas. The ultimate in comfort and elegance.",
      size: "55 sqm",
      capacity: "4 guests",
      popular: false,
    },
  ];

  return (
    <section
      id="accommodations"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-deep-blue">
            Luxury Accommodations
            <span className="block text-2xl text-gray-600 font-normal mt-2">
              Choose Your Perfect Mountain Retreat
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each room is thoughtfully designed to provide the ultimate comfort
            while showcasing the breathtaking beauty of the Himalayas. Book now
            and save up to 25%!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className={`bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                room.popular
                  ? "ring-4 ring-vibrant-pink ring-opacity-50 scale-105"
                  : ""
              } ${selectedRoom === room.id ? "ring-4 ring-blue-500" : ""}`}
              onClick={() =>
                setSelectedRoom(selectedRoom === room.id ? null : room.id)
              }
            >
              {/* Popular Badge */}
              {room.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-vibrant-pink text-white px-3 py-1 rounded-full text-sm font-bold">
                    🔥 Most Popular
                  </div>
                </div>
              )}

              {/* Room Image with Dummy Graphics */}
              <div className={`h-64 ${room.image} relative overflow-hidden`}>
                {/* Dummy Room Graphics */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">🏔️</div>
                    <div className="text-xl font-semibold">{room.name}</div>
                  </div>
                </div>

                {/* Savings Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Save ${room.savings}!
                  </div>
                </div>

                {/* Room Details Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm opacity-90">
                        {room.size} • {room.capacity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm line-through opacity-75">
                        ${room.originalPrice}/night
                      </div>
                      <div className="text-2xl font-bold">
                        ${room.discountedPrice}/night
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {room.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {room.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    ✨ Included Features:
                  </h4>
                  <div className="space-y-1">
                    {room.features.slice(0, 3).map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-2 h-2 bg-vibrant-pink rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                    {room.features.length > 3 && (
                      <div className="text-sm text-vibrant-pink font-semibold">
                        +{room.features.length - 3} more amenities
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedRoom === room.id && (
                  <div className="border-t pt-4 mb-4 animate-fadeIn">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      All Amenities:
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {room.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-gray-500 line-through">
                      ${room.originalPrice}/night
                    </div>
                    <div className="text-3xl font-bold text-vibrant-pink">
                      ${room.discountedPrice}/night
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      Save ${room.savings} (25% off)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Per night</div>
                    <div className="text-lg font-semibold text-gray-800">
                      Best Rate Guaranteed
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button
                    className="w-full bg-gradient-to-r from-vibrant-pink to-warm-red text-white font-bold py-3 rounded-xl hover:from-warm-red hover:to-vibrant-pink transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-vibrant-pink focus:ring-opacity-50 shadow-lg"
                    aria-label={`Book ${room.name} and save $${room.savings}`}
                  >
                    🚀 Book Now - Save 25%
                  </button>
                  <button
                    className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-xl hover:border-vibrant-pink hover:text-vibrant-pink transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoom(
                        selectedRoom === room.id ? null : room.id
                      );
                    }}
                  >
                    {selectedRoom === room.id ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-4 text-center text-xs text-gray-500">
                  ✅ Free Cancellation • ✅ No Hidden Fees • ✅ Instant
                  Confirmation
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-vibrant-pink to-warm-red rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Can't Decide? Let Us Help!
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Our travel experts will recommend the perfect room based on your
              preferences and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-vibrant-pink font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                📞 Call Our Experts
              </button>
              <button className="bg-yellow-400 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition-colors">
                💬 Live Chat Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accommodations;
