import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { FaTimes, FaCalendarAlt, FaUsers, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../contexts/BookingContext";
import { bookingIntegrationService } from "../services/BookingIntegrationService";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoomOption {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  size: string;
  beds: string;
  occupancy: string;
  features: string[];
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { bookingData, updateBookingData, goToStep, resetBookingData } =
    useBooking();
  const { step, checkIn, checkOut, guests, selectedRoom, guestInfo } =
    bookingData;

  const [backgroundImages, setBackgroundImages] = useState<string[]>([
    "/himalayas-bg.jpg",
    "/himalayas-bg.jpg",
    "/himalayas-bg.jpg",
  ]);
  const navigate = useNavigate();

  const rooms: RoomOption[] = [
    {
      id: "deluxe-mountain",
      name: "Deluxe Mountain View",
      price: 149,
      image: backgroundImages[0],
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
      image: backgroundImages[1],
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
      image: backgroundImages[2],
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

  // Load background images from media gallery (placeholder for now)
  useEffect(() => {
    // TODO: Integrate with actual media gallery
    // For now, using placeholder images
    const loadImages = async () => {
      try {
        // This would be replaced with actual media gallery integration
        const response = await fetch("http://localhost:5000/api/media");
        if (response.ok) {
          const mediaData = await response.json();
          // Filter for room/background images and use them
          const roomImages = mediaData
            .filter(
              (item: any) => item.type === "image" && item.category === "rooms"
            )
            .slice(0, 3);

          if (roomImages.length > 0) {
            setBackgroundImages(roomImages.map((item: any) => item.url));
          }
        }
      } catch (error) {
        console.log("Using default background images");
      }
    };

    loadImages();
  }, []);

  const canProceedToRooms =
    checkIn && checkOut && new Date(checkOut) > new Date(checkIn);

  const canCompleteBooking =
    selectedRoom && guestInfo.fullName && guestInfo.email && guestInfo.phone;

  // Debug validation
  console.log("Validation debug:", {
    selectedRoom,
    fullName: guestInfo.fullName,
    email: guestInfo.email,
    phone: guestInfo.phone,
    canComplete: canCompleteBooking,
  });

  const handleProceedToRooms = () => {
    if (canProceedToRooms) {
      goToStep("rooms");
    }
  };

  const handleRoomSelection = (roomId: string) => {
    // Update the context with the selected room
    updateBookingData({ selectedRoom: roomId });

    // Move to confirmation step after a small delay to ensure state update
    setTimeout(() => {
      goToStep("confirmation");
    }, 0);
  };

  const handleCompleteBooking = async () => {
    try {
      // Process the booking through the integration service
      const result = await bookingIntegrationService.processNewBooking({
        checkIn,
        checkOut,
        guests,
        selectedRoom: selectedRoom!,
        guestInfo,
      });

      if (result.success) {
        // Show success message
        alert(
          `Booking confirmed! ${guestInfo.fullName} has been added to our guest list.`
        );

        // Save final booking data to localStorage for Rooms page
        const finalBookingData = {
          selectedRoom,
          checkIn,
          checkOut,
          guests,
          guestInfo,
        };
        localStorage.setItem(
          "finalBookingData",
          JSON.stringify(finalBookingData)
        );

        // Close modal and navigate to rooms
        onClose();
        navigate("/rooms");

        // Reset booking data
        resetBookingData();
      } else {
        console.error("Failed to process booking:", result.error);
        alert(`Booking failed: ${result.error}. Please try again.`);
      }
    } catch (error) {
      console.error("Error completing booking:", error);
      alert(
        "An error occurred while processing your booking. Please try again."
      );
    }
  };

  const resetModal = () => {
    resetBookingData();
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

        <div className="relative bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden">
          {/* Step Indicators */}
          <div className="bg-gray-50 px-8 py-4 border-b">
            <div className="flex items-center justify-center space-x-8">
              <div
                className={`flex items-center space-x-2 ${
                  step === "dates" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === "dates"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="font-medium">Dates & Guests</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  step === "rooms" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === "rooms"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Room Selection</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  step === "confirmation" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === "confirmation"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span className="font-medium">Guest Info & Confirm</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-20 transition-colors"
          >
            <FaTimes size={28} />
          </button>

          {/* Step 1: Date Selection */}
          {step === "dates" && (
            <div className="relative">
              {/* Hero Background */}
              <div className="relative h-96 bg-gradient-to-br from-deep-blue via-blue-600 to-purple-700 overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Plan Your
                    <span className="block text-yellow-300">
                      Mountain Escape
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl opacity-90 max-w-2xl leading-relaxed">
                    Begin your journey by selecting your perfect dates for an
                    unforgettable stay
                  </p>
                </div>
              </div>

              {/* Date Selection Form */}
              <div className="px-8 py-12 bg-white">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      When Would You Like to Visit?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Choose your check-in and check-out dates to discover
                      available rooms and exclusive rates
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Check-in Date */}
                    <div className="text-center">
                      <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-200 transition-colors">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaCalendarAlt className="text-white text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Check-in Date
                        </h3>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) =>
                            updateBookingData({ checkIn: e.target.value })
                          }
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-center text-lg"
                        />
                      </div>
                    </div>

                    {/* Check-out Date */}
                    <div className="text-center">
                      <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-100 hover:border-green-200 transition-colors">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaCalendarAlt className="text-white text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Check-out Date
                        </h3>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) =>
                            updateBookingData({ checkOut: e.target.value })
                          }
                          min={
                            checkIn || new Date().toISOString().split("T")[0]
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all text-center text-lg"
                        />
                      </div>
                    </div>

                    {/* Guest Count */}
                    <div className="text-center">
                      <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-100 hover:border-purple-200 transition-colors">
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaUsers className="text-white text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          Number of Guests
                        </h3>
                        <select
                          value={guests}
                          onChange={(e) =>
                            updateBookingData({ guests: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all text-center text-lg"
                        >
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="3">3 Guests</option>
                          <option value="4">4 Guests</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Proceed Button */}
                  <div className="text-center">
                    <button
                      onClick={handleProceedToRooms}
                      disabled={!canProceedToRooms}
                      className={`inline-flex items-center px-8 py-4 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                        canProceedToRooms
                          ? "bg-gradient-to-r from-vibrant-pink to-warm-red text-white hover:shadow-2xl focus:ring-vibrant-pink/30"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Discover Available Rooms
                      <FaArrowRight className="ml-3 text-xl" />
                    </button>

                    {!canProceedToRooms && checkIn && checkOut && (
                      <p className="text-red-500 mt-3 text-sm">
                        Check-out date must be after check-in date
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Room Selection */}
          {step === "rooms" && (
            <div className="relative">
              {/* Header */}
              <div className="bg-gradient-to-r from-deep-blue to-blue-600 text-white py-16 px-8">
                <div className="text-center max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Our Mountain Haven Rooms
                  </h2>
                  <p className="text-xl opacity-90 leading-relaxed">
                    Select your perfect retreat in our intimate family-run lodge
                  </p>
                </div>
              </div>

              {/* Room Gallery */}
              <div className="px-8 py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {rooms.map((room, index) => (
                      <div
                        key={room.id}
                        className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                        onClick={() => handleRoomSelection(room.id)}
                      >
                        {/* Background Image */}
                        <div className="relative h-80 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />

                          {/* Price Badge */}
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-deep-blue px-4 py-2 rounded-full font-bold text-lg">
                            ${room.price}
                          </div>

                          {/* Room Name Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="text-2xl font-bold mb-2">
                              {room.name}
                            </h3>
                            <p className="text-sm opacity-90 leading-relaxed">
                              {room.description}
                            </p>
                          </div>
                        </div>

                        {/* Room Details */}
                        <div className="p-6">
                          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                            <div>
                              <div className="text-2xl font-bold text-deep-blue mb-1">
                                {room.size}
                              </div>
                              <div className="text-sm text-gray-600">Size</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-deep-blue mb-1">
                                {room.beds}
                              </div>
                              <div className="text-sm text-gray-600">Beds</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-deep-blue mb-1">
                                {room.occupancy}
                              </div>
                              <div className="text-sm text-gray-600">
                                Guests
                              </div>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-3">
                              Key Features
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {room.features.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === "confirmation" && (
            <div className="relative">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 px-8">
                <div className="text-center max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Complete Your Booking
                  </h2>
                  <p className="text-xl opacity-90">
                    You're almost there! Review your selection and confirm your
                    stay
                  </p>
                </div>
              </div>

              {/* Confirmation Details */}
              <div className="px-8 py-16 bg-white">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                      Booking Summary
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Room Details */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-4 text-lg">
                          Selected Room
                        </h4>
                        {selectedRoom ? (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Room Type:</span>
                              <span className="font-medium">
                                {rooms.find((r) => r.id === selectedRoom)?.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Price per Night:
                              </span>
                              <span className="font-medium">
                                $
                                {
                                  rooms.find((r) => r.id === selectedRoom)
                                    ?.price
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Size:</span>
                              <span className="font-medium">
                                {rooms.find((r) => r.id === selectedRoom)?.size}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-red-500 mb-2">
                              ⚠️ No room selected
                            </div>
                            <button
                              onClick={() => goToStep("rooms")}
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                              Go back to select a room
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Stay Details */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-4 text-lg">
                          Stay Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Check-in:</span>
                            <span className="font-medium">
                              {new Date(checkIn).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Check-out:</span>
                            <span className="font-medium">
                              {new Date(checkOut).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Guests:</span>
                            <span className="font-medium">{guests}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guest Information Form */}
                  <div className="bg-white rounded-2xl p-8 mb-8 border-2 border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                      Guest Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Primary Guest */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-4 text-lg">
                          Primary Guest
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={guestInfo.fullName}
                              onChange={(e) =>
                                updateBookingData({
                                  guestInfo: {
                                    ...guestInfo,
                                    fullName: e.target.value,
                                  },
                                })
                              }
                              placeholder="Enter your full name"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={guestInfo.email}
                              onChange={(e) =>
                                updateBookingData({
                                  guestInfo: {
                                    ...guestInfo,
                                    email: e.target.value,
                                  },
                                })
                              }
                              placeholder="Enter your email address"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={guestInfo.phone}
                              onChange={(e) =>
                                updateBookingData({
                                  guestInfo: {
                                    ...guestInfo,
                                    phone: e.target.value,
                                  },
                                })
                              }
                              placeholder="Enter your phone number"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-4 text-lg">
                          Additional Information
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Special Requests
                            </label>
                            <textarea
                              value={guestInfo.specialRequests}
                              onChange={(e) =>
                                updateBookingData({
                                  guestInfo: {
                                    ...guestInfo,
                                    specialRequests: e.target.value,
                                  },
                                })
                              }
                              placeholder="Any special requests or preferences?"
                              rows={3}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Arrival Time
                            </label>
                            <select
                              value={guestInfo.arrivalTime}
                              onChange={(e) =>
                                updateBookingData({
                                  guestInfo: {
                                    ...guestInfo,
                                    arrivalTime: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                            >
                              <option value="">Select arrival time</option>
                              <option value="morning">
                                Morning (8 AM - 12 PM)
                              </option>
                              <option value="afternoon">
                                Afternoon (12 PM - 4 PM)
                              </option>
                              <option value="evening">
                                Evening (4 PM - 8 PM)
                              </option>
                              <option value="late">
                                Late Evening (8 PM - 12 AM)
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validation Status */}
                  {!canCompleteBooking && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="text-red-800 font-semibold mb-2">
                        Required Fields Missing:
                      </h4>
                      <ul className="text-red-700 text-sm space-y-1">
                        {!selectedRoom && <li>• Room selection is required</li>}
                        {!guestInfo.fullName && (
                          <li>• Full name is required</li>
                        )}
                        {!guestInfo.email && (
                          <li>• Email address is required</li>
                        )}
                        {!guestInfo.phone && (
                          <li>• Phone number is required</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => goToStep("dates")}
                      className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors"
                    >
                      ← Back to Dates
                    </button>
                    <button
                      onClick={() => goToStep("rooms")}
                      className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors"
                    >
                      Choose Different Room
                    </button>
                    <button
                      onClick={handleCompleteBooking}
                      disabled={!canCompleteBooking}
                      className={`px-8 py-4 font-bold rounded-xl transition-all duration-300 ${
                        canCompleteBooking
                          ? "bg-gradient-to-r from-vibrant-pink to-warm-red text-white hover:shadow-2xl transform hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {canCompleteBooking
                        ? "Confirm & Complete Booking"
                        : "Please fill all required fields"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default BookingModal;
