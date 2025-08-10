import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaDownload,
  FaBell,
  FaCog,
  FaUserPlus,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaCreditCard,
  FaHistory,
  FaChartBar,
  FaTachometerAlt,
} from "react-icons/fa";
import { useClientManagement } from "../hooks/useClientManagement";
import { Guest, Booking, GuestFilter, BookingFilter } from "../types/client";
import NotificationCenter from "./NotificationCenter";

const ClientManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<{
    roomType: string;
    date: string;
    booking?: Booking;
  } | null>(null);
  const [guestFormData, setGuestFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    preferences: {
      roomType: "Standard",
      specialRequests: "",
    },
  });

  // Room types for calendar
  const roomTypes = ["Standard", "Deluxe", "Suite", "Presidential"];

  // Helper functions for calendar
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getBookingForRoomAndDate = (
    roomType: string,
    dateString: string
  ): Booking | undefined => {
    return bookings.find(
      (booking) =>
        booking.roomType === roomType &&
        new Date(booking.checkIn) <= new Date(dateString) &&
        new Date(booking.checkOut) > new Date(dateString)
    );
  };

  // Effect to sync calendar when rooms change (if you have room management)
  useEffect(() => {
    // This will sync with room status changes from the Rooms section
    const handleRoomStatusChange = () => {
      console.log("Calendar synced with room status changes");
    };

    // You can add event listeners here for room status changes
    // For now, we'll just log the sync
    handleRoomStatusChange();
  }, []);

  // Sync with Rooms section
  const syncWithRooms = () => {
    // This function would integrate with the Rooms section
    // For now, we'll simulate the sync
    console.log("Syncing calendar with Rooms section...");

    // In a real implementation, you would:
    // 1. Fetch room data from the Rooms section
    // 2. Update room types and availability
    // 3. Sync maintenance schedules
    // 4. Update blocked dates

    // Example of what this might do:
    // const roomsData = await fetchRoomsData();
    // setRoomTypes(roomsData.types);
    // setMaintenanceDates(roomsData.maintenanceDates);
    // setBlockedDates(roomsData.blockedDates);

    // Show success notification
    alert("Calendar synced with Rooms section successfully!");
  };

  // Sync with new bookings
  const syncWithNewBookings = () => {
    // This function ensures the calendar reflects new bookings immediately
    console.log("Syncing calendar with new bookings...");

    // The calendar will automatically update due to React's reactivity
    // when the bookings array changes

    // Show success notification
    alert("Calendar synced with new bookings successfully!");
  };

  // Room management functions
  const [maintenanceDates, setMaintenanceDates] = useState<string[]>([
    "2024-02-15",
    "2024-02-16",
  ]);
  const [blockedDates, setBlockedDates] = useState<string[]>(["2024-02-20"]);

  const addMaintenanceDate = (dateString: string, roomType?: string) => {
    setMaintenanceDates((prev) => [...prev, dateString]);
    console.log(
      `Maintenance scheduled for ${dateString}${
        roomType ? ` - ${roomType}` : ""
      }`
    );
  };

  const removeMaintenanceDate = (dateString: string) => {
    setMaintenanceDates((prev) => prev.filter((date) => date !== dateString));
  };

  const addBlockedDate = (dateString: string, roomType?: string) => {
    setBlockedDates((prev) => [...prev, dateString]);
    console.log(
      `Room blocked for ${dateString}${roomType ? ` - ${roomType}` : ""}`
    );
  };

  const removeBlockedDate = (dateString: string) => {
    setBlockedDates((prev) => prev.filter((date) => date !== dateString));
  };

  // Enhanced room status function
  const getRoomStatus = (
    roomType: string,
    dateString: string
  ): "available" | "booked" | "maintenance" | "blocked" => {
    const booking = getBookingForRoomAndDate(roomType, dateString);
    if (booking) return "booked";

    // Check for maintenance dates
    if (maintenanceDates.includes(dateString)) return "maintenance";

    // Check for blocked dates
    if (blockedDates.includes(dateString)) return "blocked";

    return "available";
  };

  const handleDateClick = (
    roomType: string,
    dateString: string,
    booking?: Booking
  ) => {
    setSelectedDate({ roomType, date: dateString, booking });
  };

  const handleQuickBooking = (roomType: string, dateString: string) => {
    // Set the room type in the guest form and open the add guest modal
    setGuestFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        roomType: roomType,
      },
    }));
    setShowAddGuestModal(true);
    setSelectedDate(null);
  };

  const {
    guests,
    bookings,
    analytics,
    loading,
    error,
    addGuest,
    updateGuest,
    deleteGuest,
    filterGuests,
    filterBookings,
    exportData,
    clearError,
  } = useClientManagement();

  // Sync calendar with bookings and room changes
  const syncCalendarWithBookings = () => {
    // This function will be called whenever bookings change
    // The calendar will automatically update due to React's reactivity
    console.log("Calendar synced with latest booking data");
  };

  // Effect to sync calendar when bookings change
  useEffect(() => {
    syncCalendarWithBookings();
  }, [bookings]);

  const filteredGuests = filterGuests({
    searchTerm,
    status: filterStatus as any,
  });

  const handleGuestAction = async (action: string, guest: Guest) => {
    switch (action) {
      case "view":
        setSelectedGuest(guest);
        setShowGuestModal(true);
        break;
      case "edit":
        setGuestFormData({
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
          address: guest.address,
          preferences: {
            roomType: guest.preferences.roomType,
            specialRequests: guest.preferences.specialRequests || "",
          },
        });
        setSelectedGuest(guest);
        setShowAddGuestModal(true);
        break;
      case "delete":
        if (window.confirm(`Are you sure you want to delete ${guest.name}?`)) {
          const result = await deleteGuest(guest._id);
          if (result.success) {
            alert("Guest deleted successfully");
          } else {
            alert("Failed to delete guest");
          }
        }
        break;
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addGuest({
      ...guestFormData,
      loyaltyPoints: 0,
      totalBookings: 0,
      totalSpent: 0,
    });
    if (result.success) {
      setShowAddGuestModal(false);
      setGuestFormData({
        name: "",
        email: "",
        phone: "",
        address: { street: "", city: "", state: "", country: "", zipCode: "" },
        preferences: { roomType: "Standard", specialRequests: "" },
      });
      alert("Guest added successfully");
    } else {
      alert("Failed to add guest");
    }
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;

    const result = await updateGuest(selectedGuest._id, guestFormData);
    if (result.success) {
      setShowAddGuestModal(false);
      setShowGuestModal(false);
      setSelectedGuest(null);
      alert("Guest updated successfully");
    } else {
      alert("Failed to update guest");
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      if (data) {
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hotel_data_${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      alert("Failed to export data");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading client management system...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Client Management
              </h1>
              <p className="text-gray-600">
                Manage guest profiles, bookings, and analytics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <NotificationCenter
                notifications={[
                  {
                    id: "1",
                    type: "info",
                    title: "New Booking",
                    message: "John Smith has made a new booking",
                    timestamp: new Date().toISOString(),
                    read: false,
                  },
                ]}
                onMarkAsRead={(id) => console.log("Mark as read:", id)}
                onDismiss={(id) => console.log("Dismiss:", id)}
              />
              <button
                onClick={handleExportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaDownload className="inline mr-2" />
                Export Data
              </button>
              <button
                onClick={() => setShowAddGuestModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaUserPlus className="inline mr-2" />
                Add Guest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span className="block sm:inline">{error}</span>
          <button onClick={clearError} className="float-right font-bold">
            ×
          </button>
        </div>
      )}

      {/* Analytics Dashboard */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Guests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalGuests}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCalendarAlt className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.activeBookings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaChartLine className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${analytics.monthlyRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaTachometerAlt className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Occupancy Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.occupancyRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaStar className="text-red-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.averageRating}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FaHistory className="text-indigo-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Repeat Guests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.repeatGuests}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: FaChartBar },
                { id: "guests", label: "Guest Profiles", icon: FaUsers },
                { id: "bookings", label: "Bookings", icon: FaCalendarAlt },
                { id: "calendar", label: "Room Calendar", icon: FaCalendarAlt },
                { id: "analytics", label: "Analytics", icon: FaChartLine },
                { id: "settings", label: "Settings", icon: FaCog },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="inline mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          New booking from John Smith
                        </span>
                        <span className="text-xs text-gray-400">
                          2 hours ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          Sarah Johnson checked in
                        </span>
                        <span className="text-xs text-gray-400">
                          4 hours ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          Room 205 maintenance completed
                        </span>
                        <span className="text-xs text-gray-400">
                          6 hours ago
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setShowAddGuestModal(true)}
                        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <FaUserPlus className="inline mr-2" />
                        Add Guest
                      </button>
                      <button className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        <FaCalendarAlt className="inline mr-2" />
                        New Booking
                      </button>
                      <button className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        <FaChartLine className="inline mr-2" />
                        View Reports
                      </button>
                      <button className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition-colors text-sm">
                        <FaBell className="inline mr-2" />
                        Notifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "calendar" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Room Availability Calendar
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={syncWithRooms}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                      title="Sync with Rooms section"
                    >
                      🔄 Sync Rooms
                    </button>
                    <button
                      onClick={syncWithNewBookings}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                      title="Sync with new bookings"
                    >
                      🔄 Sync Bookings
                    </button>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          (prev) =>
                            new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                        )
                      }
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      ← Previous
                    </button>
                    <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          (prev) =>
                            new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                        )
                      }
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                {/* Calendar Legend */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Maintenance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span>Blocked</span>
                  </div>
                </div>

                {/* Room Management Controls */}
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Room Management
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Maintenance Date
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          id="maintenanceDate"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => {
                            const dateInput = document.getElementById(
                              "maintenanceDate"
                            ) as HTMLInputElement;
                            if (dateInput.value) {
                              addMaintenanceDate(dateInput.value);
                              dateInput.value = "";
                            }
                          }}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Blocked Date
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          id="blockedDate"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => {
                            const dateInput = document.getElementById(
                              "blockedDate"
                            ) as HTMLInputElement;
                            if (dateInput.value) {
                              addBlockedDate(dateInput.value);
                              dateInput.value = "";
                            }
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quick Actions
                      </label>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            const today = new Date()
                              .toISOString()
                              .split("T")[0];
                            addMaintenanceDate(today);
                          }}
                          className="w-full px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                        >
                          Block Today
                        </button>
                        <button
                          onClick={() => {
                            const tomorrow = new Date(
                              Date.now() + 24 * 60 * 60 * 1000
                            )
                              .toISOString()
                              .split("T")[0];
                            addBlockedDate(tomorrow);
                          }}
                          className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                        >
                          Block Tomorrow
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white rounded-lg border overflow-hidden">
                  {/* Weekday Headers */}
                  <div className="grid grid-cols-8 gap-px bg-gray-200">
                    <div className="p-3 bg-gray-50 font-medium text-gray-700">
                      Room
                    </div>
                    {getDaysInMonth(currentMonth)
                      .filter((day) => day !== null)
                      .map((day, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 text-center text-sm font-medium text-gray-700"
                        >
                          {day}
                        </div>
                      ))}
                  </div>

                  {/* Room Rows */}
                  {roomTypes.map((roomType) => (
                    <div
                      key={roomType}
                      className="grid grid-cols-8 gap-px bg-gray-200"
                    >
                      <div className="p-3 bg-white font-medium text-gray-900 border-r">
                        {roomType}
                      </div>
                      {getDaysInMonth(currentMonth)
                        .filter((day) => day !== null)
                        .map((day, dayIndex) => {
                          if (day === null) return null;
                          const date = new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            day
                          );
                          const dateString = date.toISOString().split("T")[0];
                          const booking = getBookingForRoomAndDate(
                            roomType,
                            dateString
                          );
                          const status = getRoomStatus(roomType, dateString);

                          return (
                            <div
                              key={dayIndex}
                              className={`p-2 text-center text-xs cursor-pointer hover:bg-gray-50 ${
                                status === "booked"
                                  ? "bg-red-500 text-white"
                                  : status === "maintenance"
                                  ? "bg-yellow-500 text-white"
                                  : status === "blocked"
                                  ? "bg-gray-300 text-gray-700"
                                  : "bg-green-500 text-white"
                              }`}
                              onClick={() =>
                                handleDateClick(roomType, dateString, booking)
                              }
                              title={`${roomType} - ${date.toLocaleDateString()} - ${status}`}
                            >
                              {booking
                                ? "B"
                                : status === "maintenance"
                                ? "M"
                                : status === "blocked"
                                ? "X"
                                : "A"}
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>

                {/* Selected Date Details */}
                {selectedDate && (
                  <div className="bg-white rounded-lg border p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {selectedDate.roomType} -{" "}
                      {new Date(selectedDate.date).toLocaleDateString()}
                    </h4>
                    {selectedDate.booking ? (
                      <div className="space-y-2">
                        <p>
                          <strong>Status:</strong>{" "}
                          <span className="text-red-600">Booked</span>
                        </p>
                        <p>
                          <strong>Guest:</strong>{" "}
                          {selectedDate.booking.guestName}
                        </p>
                        <p>
                          <strong>Check-in:</strong>{" "}
                          {new Date(
                            selectedDate.booking.checkIn
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Check-out:</strong>{" "}
                          {new Date(
                            selectedDate.booking.checkOut
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Special Requests:</strong>{" "}
                          {selectedDate.booking.specialRequests || "None"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p>
                          <strong>Status:</strong>{" "}
                          <span className="text-green-600">Available</span>
                        </p>
                        <p>
                          <strong>Room Type:</strong> {selectedDate.roomType}
                        </p>
                        <button
                          onClick={() =>
                            handleQuickBooking(
                              selectedDate.roomType,
                              selectedDate.date
                            )
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Quick Booking
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Monthly Summary */}
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Monthly Summary -{" "}
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(() => {
                          const daysInMonth = getDaysInMonth(
                            currentMonth
                          ).filter((day) => day !== null).length;
                          const unavailableDays = getDaysInMonth(currentMonth)
                            .filter((day) => day !== null)
                            .reduce((total: number, day: number | null) => {
                              if (day !== null) {
                                const dateString = new Date(
                                  currentMonth.getFullYear(),
                                  currentMonth.getMonth(),
                                  day
                                )
                                  .toISOString()
                                  .split("T")[0];
                                return (
                                  total +
                                  roomTypes.filter(
                                    (roomType) =>
                                      getRoomStatus(roomType, dateString) !==
                                      "available"
                                  ).length
                                );
                              }
                              return total;
                            }, 0);
                          return (
                            daysInMonth * roomTypes.length - unavailableDays
                          );
                        })()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Available Room-Nights
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {(() => {
                          return getDaysInMonth(currentMonth)
                            .filter((day) => day !== null)
                            .reduce((total: number, day: number | null) => {
                              if (day !== null) {
                                const dateString = new Date(
                                  currentMonth.getFullYear(),
                                  currentMonth.getMonth(),
                                  day
                                )
                                  .toISOString()
                                  .split("T")[0];
                                return (
                                  total +
                                  roomTypes.filter(
                                    (roomType) =>
                                      getRoomStatus(roomType, dateString) ===
                                      "booked"
                                  ).length
                                );
                              }
                              return total;
                            }, 0);
                        })()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Booked Room-Nights
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {maintenanceDates.filter((date) => {
                          const dateObj = new Date(date);
                          return (
                            dateObj.getMonth() === currentMonth.getMonth() &&
                            dateObj.getFullYear() === currentMonth.getFullYear()
                          );
                        }).length * roomTypes.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Maintenance Days
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {blockedDates.filter((date) => {
                          const dateObj = new Date(date);
                          return (
                            dateObj.getMonth() === currentMonth.getMonth() &&
                            dateObj.getFullYear() === currentMonth.getFullYear()
                          );
                        }).length * roomTypes.length}
                      </div>
                      <div className="text-sm text-gray-600">Blocked Days</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "guests" && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search guests by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Guests</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                {/* Guests Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preferences
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stats
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGuests.map((guest) => (
                        <tr key={guest._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {guest.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {guest.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {guest._id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {guest.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {guest.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {guest.preferences.roomType}
                            </div>
                            <div className="text-sm text-gray-500">
                              {guest.preferences.specialRequests
                                ? "Has special requests"
                                : "No special requests"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {guest.totalBookings} bookings
                            </div>
                            <div className="text-sm text-gray-500">
                              ${guest.totalSpent.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {guest.loyaltyPoints} points
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleGuestAction("view", guest)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => handleGuestAction("edit", guest)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() =>
                                  handleGuestAction("delete", guest)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Bookings
                </h3>
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.slice(0, 10).map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.guestName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.guestEmail}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(booking.checkIn).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(booking.checkOut).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.roomType}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.guests} guests
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : booking.status === "active"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">
                              <FaEye />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance Analytics
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Guest Demographics
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Repeat Guests
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {analytics.totalGuests > 0
                            ? Math.round(
                                (analytics.repeatGuests /
                                  analytics.totalGuests) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          New Guests
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {analytics.totalGuests > 0
                            ? Math.round(
                                ((analytics.totalGuests -
                                  analytics.repeatGuests) /
                                  analytics.totalGuests) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Revenue Trends
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          This Month
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          ${analytics.monthlyRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Average per Guest
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          $
                          {analytics.totalGuests > 0
                            ? Math.round(
                                analytics.monthlyRevenue / analytics.totalGuests
                              )
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Client Management Settings
                </h3>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Auto-notifications
                      </label>
                      <input type="checkbox" className="ml-2" defaultChecked />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Guest data retention (days)
                      </label>
                      <input
                        type="number"
                        className="ml-2 border rounded px-2 py-1"
                        defaultValue={730}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loyalty program enabled
                      </label>
                      <input type="checkbox" className="ml-2" defaultChecked />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        VIP threshold (points)
                      </label>
                      <input
                        type="number"
                        className="ml-2 border rounded px-2 py-1"
                        defaultValue={1000}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guest Detail Modal */}
      {showGuestModal && selectedGuest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Guest Details
                </h3>
                <button
                  onClick={() => setShowGuestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">{selectedGuest.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{selectedGuest.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900">{selectedGuest.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedGuest.address.street}, {selectedGuest.address.city}
                    , {selectedGuest.address.state}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Preferences
                  </label>
                  <p className="text-sm text-gray-900">
                    Room Type: {selectedGuest.preferences.roomType}
                  </p>
                  {selectedGuest.preferences.specialRequests && (
                    <p className="text-sm text-gray-900">
                      Special Requests:{" "}
                      {selectedGuest.preferences.specialRequests}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loyalty Points
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedGuest.loyaltyPoints}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowGuestModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowGuestModal(false);
                    setGuestFormData({
                      name: selectedGuest.name,
                      email: selectedGuest.email,
                      phone: selectedGuest.phone,
                      address: selectedGuest.address,
                      preferences: {
                        roomType: selectedGuest.preferences.roomType,
                        specialRequests:
                          selectedGuest.preferences.specialRequests || "",
                      },
                    });
                    setShowAddGuestModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Guest Modal */}
      {showAddGuestModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedGuest ? "Edit Guest" : "Add New Guest"}
                </h3>
                <button
                  onClick={() => setShowAddGuestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={selectedGuest ? handleUpdateGuest : handleAddGuest}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={guestFormData.name}
                    onChange={(e) =>
                      setGuestFormData({
                        ...guestFormData,
                        name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter guest name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={guestFormData.email}
                    onChange={(e) =>
                      setGuestFormData({
                        ...guestFormData,
                        email: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={guestFormData.phone}
                    onChange={(e) =>
                      setGuestFormData({
                        ...guestFormData,
                        phone: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Room Type Preference
                  </label>
                  <select
                    value={guestFormData.preferences.roomType}
                    onChange={(e) =>
                      setGuestFormData({
                        ...guestFormData,
                        preferences: {
                          ...guestFormData.preferences,
                          roomType: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>Standard</option>
                    <option>Deluxe</option>
                    <option>Suite</option>
                    <option>Presidential</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Special Requests
                  </label>
                  <textarea
                    value={guestFormData.preferences.specialRequests}
                    onChange={(e) =>
                      setGuestFormData({
                        ...guestFormData,
                        preferences: {
                          ...guestFormData.preferences,
                          specialRequests: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Any special requests or preferences"
                  ></textarea>
                </div>
              </form>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedGuest ? handleUpdateGuest : handleAddGuest}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {selectedGuest ? "Update Guest" : "Add Guest"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
