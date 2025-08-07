import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const rooms = [
    {
      id: "deluxe-mountain",
      name: "Deluxe Mountain View",
      price: 149,
      image: "/room-mountain-view.jpg", // You'll need to add these images
      description:
        "Breathtaking mountain views with traditional Nepali touches",
      size: "25 sqm",
      beds: "1 King or 2 Twin",
      occupancy: "2-3 guests",
      features: [
        "Mountain View",
        "Private Balcony",
        "En-suite Bathroom",
        "Daily Breakfast",
      ],
    },
    {
      id: "family-suite",
      name: "Family Suite",
      price: 199,
      image: "/room-family-suite.jpg",
      description:
        "Spacious suite perfect for families, featuring separate living area",
      size: "35 sqm",
      beds: "1 King + 2 Twin",
      occupancy: "4 guests",
      features: [
        "Living Area",
        "Mountain View",
        "Private Terrace",
        "Family Amenities",
      ],
    },
    {
      id: "garden-cottage",
      name: "Garden Cottage",
      price: 169,
      image: "/room-garden-cottage.jpg",
      description: "Private cottage surrounded by beautiful mountain flora",
      size: "30 sqm",
      beds: "1 Queen",
      occupancy: "2 guests",
      features: [
        "Private Garden",
        "Sitting Area",
        "Traditional Decor",
        "Peace & Quiet",
      ],
    },
  ];

  const handleBooking = () => {
    // Handle booking logic
    console.log("Booking:", { selectedRoom, checkIn, checkOut, guests });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-stretch min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

        <div className="relative bg-white w-full min-h-screen overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <FaTimes size={24} />
          </button>

          {/* Header */}
          <div className="bg-deep-blue text-white py-12 px-6">
            <Dialog.Title className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Our Mountain Haven Rooms
            </Dialog.Title>
            <p className="text-xl text-center max-w-3xl mx-auto opacity-90">
              Select your perfect retreat in our intimate family-run lodge
            </p>
          </div>

          {/* Room Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[60vh]">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`relative overflow-hidden cursor-pointer transform transition-all duration-300 ${
                  selectedRoom === room.id ? "ring-4 ring-vibrant-pink" : ""
                }`}
                onClick={() => setSelectedRoom(room.id)}
              >
                {/* Room Image */}
                <div className="relative h-[80vh]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{room.name}</h3>
                    <p className="text-sm opacity-90">
                      From ${room.price}/night
                    </p>
                  </div>
                </div>

                {/* Room Details (shown when selected) */}
                {selectedRoom === room.id && (
                  <div className="absolute inset-0 bg-black/80 text-white p-4 flex flex-col justify-center animate-fadeIn">
                    <h4 className="text-xl font-bold mb-2">{room.name}</h4>
                    <p className="text-sm mb-3">{room.description}</p>
                    <div className="text-sm space-y-1 mb-3">
                      <p>🛏️ {room.beds}</p>
                      <p>📏 {room.size}</p>
                      <p>👥 {room.occupancy}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Features:</p>
                      <ul className="list-disc list-inside opacity-90">
                        {room.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Booking Form */}
          {selectedRoom ? (
            <div className="bg-deep-blue text-white py-16 px-6 animate-fadeIn">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold mb-8 text-center">
                  Complete Your Booking
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border-2 border-white/20 rounded-lg p-3 bg-white/10 text-white focus:border-white focus:ring-2 focus:ring-white/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      className="w-full border-2 border-white/20 rounded-lg p-3 bg-white/10 text-white focus:border-white focus:ring-2 focus:ring-white/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full border-2 border-white/20 rounded-lg p-3 bg-white/10 text-white focus:border-white focus:ring-2 focus:ring-white/50 transition-all"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleBooking}
                    className="bg-white text-deep-blue font-bold text-xl py-4 px-12 rounded-lg hover:bg-yellow-300 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
                  >
                    Complete Booking
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">
              Select a room to begin your booking
            </p>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default BookingModal;
