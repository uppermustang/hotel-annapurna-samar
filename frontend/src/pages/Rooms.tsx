import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/home");
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
                    ? it.images
                    : ["/himalayas-bg.jpg"],
              }))
            );
          }
        }
      } catch {}
    })();
  }, []);

  const filteredRooms = useMemo(() => {
    if (!filter) return rooms;
    return rooms.filter(
      (r) =>
        r.title.toLowerCase().includes(filter.toLowerCase()) ||
        r.view.toLowerCase().includes(filter.toLowerCase()) ||
        r.beds.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, rooms]);

  const sendBookingRequest = async () => {
    if (!selected || !checkIn || !checkOut) {
      alert("Please select dates and a room.");
      return;
    }
    setIsSubmitting(true);
    try {
      const room = rooms.find((r) => r.id === selected)!;
      const res = await fetch("/api/bookings", {
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

        {/* Results */}
        <section className="container mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold mb-4">
            {filteredRooms.length} properties found
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64">
                  <img
                    src={room.images[0] || "/himalayas-bg.jpg"}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={room.title}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1 leading-tight">
                    {room.title}
                  </h3>
                  <div className="text-sm text-gray-600 mb-2">
                    {room.capacity} guests • {room.beds} • {room.view}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {room.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-gray-100 rounded-full px-3 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Select a room to request booking
                    </div>
                    <button
                      className={`rounded-full px-4 py-2 text-sm ${
                        selected === room.id
                          ? "bg-deep-blue text-white"
                          : "border"
                      }`}
                      onClick={() => setSelected(room.id)}
                    >
                      {selected === room.id ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6">
            <button
              disabled={!selected || !checkIn || !checkOut || isSubmitting}
              onClick={sendBookingRequest}
              className="rounded-xl px-6 py-3 bg-vibrant-pink text-white font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Send Booking Request"}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Rooms;
