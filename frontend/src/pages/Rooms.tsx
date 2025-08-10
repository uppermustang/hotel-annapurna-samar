import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useClientManagement } from "../hooks/useClientManagement";
import { Guest } from "../types/client";
import { FaCrown, FaHeart, FaUser, FaStar } from "react-icons/fa";

type RoomCard = {
  id: string;
  title: string;
  beds: string;
  view: string;
  capacity: number;
  tags: string[];
  images: string[];
};

const DEFAULT_ROOMS: RoomCard[] = [
  {
    id: "king-mountain",
    title: "King Bed • Mountain View",
    beds: "1 King",
    view: "Mountain View",
    capacity: 2,
    tags: ["Suitable for children"],
    images: ["/himalayas-bg.jpg"],
  },
  {
    id: "double-forest",
    title: "Double Bed • Forest View",
    beds: "1 Double",
    view: "Forest View",
    capacity: 2,
    tags: ["Suitable for infants"],
    images: ["/himalayas-bg.jpg"],
  },
  {
    id: "two-queen-trees",
    title: "Two Queens • View of Trees",
    beds: "2 Queen",
    view: "Forest View",
    capacity: 4,
    tags: ["Family favorite"],
    images: ["/himalayas-bg.jpg"],
  },
];

const Rooms: React.FC = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [filter, setFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<RoomCard[]>(DEFAULT_ROOMS);
  const [showGuestInfo, setShowGuestInfo] = useState(false);

  // Client Management Integration
  const { guests: clientGuests, getGuestsForRooms } = useClientManagement();

  // Helper function to normalize image paths for frontend display
  const normalizeImagePath = (path: string) => {
    if (!path) return "/himalayas-bg.jpg";
    const normalized = path.replace(/\\/g, "/");
    if (normalized.startsWith("http")) return normalized;
    return `http://localhost:5000${
      normalized.startsWith("/") ? normalized : `/${normalized}`
    }`;
  };

  // Calculate room preference score based on guest history
  const getRoomPreferenceScore = (room: RoomCard, guests: Guest[]): number => {
    let score = 0;

    guests.forEach((guest) => {
      // Check if guest has stayed in similar rooms
      if (guest.preferences?.roomType) {
        if (
          room.title
            .toLowerCase()
            .includes(guest.preferences.roomType.toLowerCase())
        ) {
          score += 10;
        }
      }

      // VIP guests get priority
      if (guest.loyaltyPoints && guest.loyaltyPoints > 1000) {
        score += 5;
      }

      // Recent guests get slight preference
      if (guest.lastVisit) {
        const daysSinceVisit =
          (Date.now() - new Date(guest.lastVisit).getTime()) /
          (1000 * 60 * 60 * 24);
        if (daysSinceVisit < 30) score += 2;
      }
    });

    return score;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/home");
        if (res.ok) {
          const data = await res.json();
          const items = data?.rooms?.items || [];
          if (Array.isArray(items) && items.length) {
            setRooms(
              items.map((it: any, idx: number) => ({
                id: `room-${idx}`,
                title: it.title || "Room",
                beds: it.beds || "",
                view: it.view || "",
                capacity: Number(it.capacity || 2),
                tags: Array.isArray(it.tags) ? it.tags : [],
                images:
                  Array.isArray(it.images) && it.images.length
                    ? it.images.map(normalizeImagePath)
                    : ["/himalayas-bg.jpg"],
              }))
            );
          }
        }
      } catch {}
    })();
  }, []);

  // Enhanced room filtering with guest preferences
  const filteredRooms = useMemo(() => {
    let filtered = rooms;

    // Apply search filter
    if (filter) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(filter.toLowerCase()) ||
          r.view.toLowerCase().includes(filter.toLowerCase()) ||
          r.beds.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Apply guest preference filtering if available
    if (clientGuests.length > 0) {
      // Sort rooms by guest preference match
      filtered = filtered.sort((a, b) => {
        const aScore = getRoomPreferenceScore(a, clientGuests);
        const bScore = getRoomPreferenceScore(b, clientGuests);
        return bScore - aScore;
      });
    }

    return filtered;
  }, [filter, rooms, clientGuests]);

  // Get personalized room recommendations
  const getPersonalizedRecommendations = () => {
    if (clientGuests.length === 0) return null;

    const recentGuests = clientGuests
      .filter((guest) => guest.lastVisit)
      .sort(
        (a, b) =>
          new Date(b.lastVisit!).getTime() - new Date(a.lastVisit!).getTime()
      )
      .slice(0, 3);

    return recentGuests;
  };

  const sendBookingRequest = async () => {
    if (!selected || !checkIn || !checkOut) {
      alert("Please select dates and a room.");
      return;
    }
    setIsSubmitting(true);
    try {
      const room = rooms.find((r) => r.id === selected)!;
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: "Website Request",
          guestEmail: "request@hotelannapurnasamar.com",
          guestPhone: "+000-0000000",
          checkIn,
          checkOut,
          guests,
          roomType: room.title,
          specialRequests: "Auto-submitted from rooms page",
        }),
      });
      if (res.ok) {
        alert("Request sent! Our team will email you a confirmation.");
        setSelected(null);
      } else {
        const e = await res.json();
        alert(e.message || "Failed to submit request");
      }
    } catch {
      alert("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-deep-blue to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Our Rooms</h1>
            <p className="text-xl opacity-90">
              Experience comfort and luxury in the heart of the Himalayas
            </p>
          </div>
        </section>

        {/* Guest Information Panel */}
        {clientGuests.length > 0 && (
          <section className="bg-gray-50 py-8">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    <FaUser className="inline mr-2 text-deep-blue" />
                    Guest Insights
                  </h3>
                  <button
                    onClick={() => setShowGuestInfo(!showGuestInfo)}
                    className="text-deep-blue hover:text-blue-700 text-sm font-medium"
                  >
                    {showGuestInfo ? "Hide" : "Show"} Details
                  </button>
                </div>

                {showGuestInfo && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getPersonalizedRecommendations()?.map((guest) => (
                      <div
                        key={guest._id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">
                            {guest.name}
                          </h4>
                          {guest.loyaltyPoints &&
                            guest.loyaltyPoints > 1000 && (
                              <FaCrown
                                className="text-yellow-500"
                                title="VIP Guest"
                              />
                            )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            Last Visit:{" "}
                            {guest.lastVisit
                              ? new Date(guest.lastVisit).toLocaleDateString()
                              : "N/A"}
                          </p>
                          <p>
                            Preferred Room:{" "}
                            {guest.preferences?.roomType || "Any"}
                          </p>
                          <p>Loyalty Points: {guest.loyaltyPoints || 0}</p>
                          {guest.preferences?.specialRequests && (
                            <p className="text-xs text-gray-500">
                              Special Requests:{" "}
                              {guest.preferences.specialRequests}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Room Filtering and Search */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={filter || ""}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-blue focus:border-transparent"
                />
              </div>

              {/* Guest Count Display */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-deep-blue" />
                  <span className="text-gray-700">Guests: {guests}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCrown className="text-yellow-500" />
                  <span className="text-gray-700">
                    VIP Guests:{" "}
                    {
                      clientGuests.filter(
                        (g) => g.loyaltyPoints && g.loyaltyPoints > 1000
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Room Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => {
                const roomScore = getRoomPreferenceScore(room, clientGuests);
                const isRecommended = roomScore > 5;

                return (
                  <div
                    key={room.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
                      isRecommended ? "ring-2 ring-yellow-400" : ""
                    }`}
                  >
                    {/* Room Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={room.images[0] || "/himalayas-bg.jpg"}
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                      {isRecommended && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                          <FaStar className="mr-1" />
                          Recommended
                        </div>
                      )}
                    </div>

                    {/* Room Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {room.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <span className="font-medium mr-2">Beds:</span>
                          {room.beds}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span className="font-medium mr-2">View:</span>
                          {room.view}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <span className="font-medium mr-2">Capacity:</span>
                          {room.capacity} guests
                        </div>
                      </div>

                      {/* Guest Preferences Match */}
                      {clientGuests.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-700 font-medium">
                              Guest Match Score
                            </span>
                            <span className="text-blue-600 font-bold">
                              {roomScore}/20
                            </span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(roomScore / 20) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelected(room.id)}
                          className="flex-1 bg-deep-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </button>
                        <button
                          onClick={() => setSelected(room.id)}
                          className="px-4 py-2 border border-deep-blue text-deep-blue rounded-lg hover:bg-deep-blue hover:text-white transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top search/filters bar */}
        <div className="sticky top-16 z-30 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 items-center py-4">
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2">
                <span className="text-sm text-gray-700">Check-In</span>
                <input
                  type="date"
                  className="bg-transparent outline-none text-sm text-gray-900"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2">
                <span className="text-sm text-gray-700">Check-Out</span>
                <input
                  type="date"
                  className="bg-transparent outline-none text-sm text-gray-900"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2">
                <span className="text-sm text-gray-700">Guests</span>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={guests}
                  onChange={(e) =>
                    setGuests(parseInt(e.target.value || "1", 10))
                  }
                  className="w-12 bg-transparent outline-none text-sm text-gray-900"
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <input
                  placeholder="Filter: mountain, king, forest..."
                  className="border border-gray-300 rounded-full px-4 py-2 text-sm"
                  value={filter || ""}
                  onChange={(e) => setFilter(e.target.value || null)}
                />
                <button
                  className="rounded-full px-4 py-2 border text-sm"
                  onClick={() => setFilter(null)}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Request Section */}
        {selected && (
          <section className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">
                Complete Your Booking Request
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={guests}
                    onChange={(e) =>
                      setGuests(parseInt(e.target.value || "1", 10))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  disabled={!checkIn || !checkOut || isSubmitting}
                  onClick={sendBookingRequest}
                  className="bg-vibrant-pink text-white font-semibold py-3 px-6 rounded-lg hover:bg-warm-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Send Booking Request"}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Rooms;
