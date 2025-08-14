import { clientIntegrationService } from "./ClientIntegrationService";

export interface BookingIntegrationData {
  checkIn: string;
  checkOut: string;
  guests: string;
  selectedRoom: string;
  guestInfo: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests: string;
    arrivalTime: string;
  };
  roomDetails?: {
    name: string;
    type: string;
    price: number;
    size: string;
  };
}

export class BookingIntegrationService {
  private static instance: BookingIntegrationService;

  public static getInstance(): BookingIntegrationService {
    if (!BookingIntegrationService.instance) {
      BookingIntegrationService.instance = new BookingIntegrationService();
    }
    return BookingIntegrationService.instance;
  }

  /**
   * Process a new booking from the booking modal or rooms page
   * This will create both a guest profile and a booking record
   */
  public async processNewBooking(bookingData: BookingIntegrationData) {
    try {
      console.log("Processing new booking:", bookingData);

      // Step 1: Check if guest already exists
      let guest = await this.findOrCreateGuest(bookingData.guestInfo);

      // Step 2: Create the booking record
      const booking = await this.createBookingRecord(bookingData, guest);

      // Step 3: Update guest statistics
      await this.updateGuestStatistics(guest._id, booking);

      // Step 4: Check for booking conflicts
      const conflicts = await this.checkBookingConflicts(bookingData);

      // Step 5: Send notifications
      await this.sendBookingNotifications(booking, guest, conflicts);

      return {
        success: true,
        guest,
        booking,
        conflicts,
        message: "Booking processed successfully!",
      };
    } catch (error) {
      console.error("Error processing booking:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Find existing guest or create new one
   */
  private async findOrCreateGuest(
    guestInfo: BookingIntegrationData["guestInfo"]
  ) {
    try {
      // Try to find existing guest by email
      const existingGuests = await clientIntegrationService.getGuests();
      let guest = existingGuests.find((g) => g.email === guestInfo.email);

      if (guest) {
        console.log("Found existing guest:", guest.name);
        return guest;
      }

      // Create new guest
      console.log("Creating new guest profile for:", guestInfo.fullName);
      const newGuest = await clientIntegrationService.addGuest({
        name: guestInfo.fullName,
        email: guestInfo.email,
        phone: guestInfo.phone,
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        preferences: {
          roomType: "Standard", // Will be updated based on booking
          specialRequests: guestInfo.specialRequests,
        },
        loyaltyPoints: 0,
        totalBookings: 0,
        totalSpent: 0,
        lastVisit: new Date().toISOString(),
      });

      return newGuest;
    } catch (error) {
      console.error("Error in findOrCreateGuest:", error);
      throw error;
    }
  }

  /**
   * Create a new booking record
   */
  private async createBookingRecord(
    bookingData: BookingIntegrationData,
    guest: any
  ) {
    try {
      // Map room ID to room type (you can expand this based on your room structure)
      const roomTypeMap: { [key: string]: string } = {
        "standard-room": "Standard",
        "deluxe-room": "Deluxe",
        "suite-room": "Suite",
        "family-suite": "Suite",
        "deluxe-mountain": "Deluxe",
        "garden-cottage": "Standard",
        "presidential-suite": "Presidential",
      };

      const roomType = roomTypeMap[bookingData.selectedRoom] || "Standard";

      const newBooking = await clientIntegrationService.addBooking({
        guestName: guest.name,
        guestEmail: guest.email,
        guestPhone: guest.phone,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        roomType: roomType,
        guests: parseInt(bookingData.guests),
        status: "confirmed" as const,
        specialRequests: bookingData.guestInfo.specialRequests,
        roomId: bookingData.selectedRoom,
        arrivalTime: bookingData.guestInfo.arrivalTime,
      });

      console.log("Created new booking:", newBooking);
      return newBooking;
    } catch (error) {
      console.error("Error creating booking record:", error);
      throw error;
    }
  }

  /**
   * Update guest statistics after booking
   */
  private async updateGuestStatistics(guestId: string, booking: any) {
    try {
      // Calculate nights and estimated revenue
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Get base price for room type
      const basePrices: { [key: string]: number } = {
        Standard: 100,
        Deluxe: 150,
        Suite: 250,
        Presidential: 500,
      };

      const basePrice = basePrices[booking.roomType] || 100;
      const estimatedRevenue = basePrice * nights;

      // Update guest with new statistics
      const currentGuest = await clientIntegrationService.getGuestById(guestId);
      if (currentGuest) {
        await clientIntegrationService.updateGuest(guestId, {
          totalBookings: (currentGuest.totalBookings || 0) + 1,
          totalSpent: (currentGuest.totalSpent || 0) + estimatedRevenue,
          lastVisit: new Date().toISOString(),
        });
      }

      console.log("Updated guest statistics");
    } catch (error) {
      console.error("Error updating guest statistics:", error);
      throw error;
    }
  }

  /**
   * Check for booking conflicts (overlapping dates for same room type)
   */
  private async checkBookingConflicts(bookingData: BookingIntegrationData) {
    try {
      const allBookings = await clientIntegrationService.getBookings();
      const roomTypeMap: { [key: string]: string } = {
        "standard-room": "Standard",
        "deluxe-room": "Deluxe",
        "suite-room": "Suite",
        "family-suite": "Suite",
        "deluxe-mountain": "Deluxe",
        "garden-cottage": "Standard",
        "presidential-suite": "Presidential",
      };

      const roomType = roomTypeMap[bookingData.selectedRoom] || "Standard";
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);

      const conflicts = allBookings.filter((booking) => {
        if (booking.roomType !== roomType) return false;
        if (booking.status === "cancelled") return false;

        const existingCheckIn = new Date(booking.checkIn);
        const existingCheckOut = new Date(booking.checkOut);

        // Check for overlap
        return (
          (checkIn >= existingCheckIn && checkIn < existingCheckOut) ||
          (checkOut > existingCheckIn && checkOut <= existingCheckOut) ||
          (checkIn <= existingCheckIn && checkOut >= existingCheckOut)
        );
      });

      if (conflicts.length > 0) {
        console.warn("Found booking conflicts:", conflicts);
      }

      return conflicts;
    } catch (error) {
      console.error("Error checking booking conflicts:", error);
      return [];
    }
  }

  /**
   * Send notifications for new bookings
   */
  private async sendBookingNotifications(
    booking: any,
    guest: any,
    conflicts: any[]
  ) {
    try {
      // Store notification in localStorage for the notification center
      const notifications = JSON.parse(
        localStorage.getItem("hotel_notifications") || "[]"
      );

      const newNotification = {
        id: Date.now().toString(),
        type: "booking",
        title: "New Booking Received",
        message: `${guest.name} has booked ${
          booking.roomType
        } room for ${new Date(
          booking.checkIn
        ).toLocaleDateString()} - ${new Date(
          booking.checkOut
        ).toLocaleDateString()}`,
        timestamp: new Date().toISOString(),
        read: false,
        data: { booking, guest, conflicts },
      };

      notifications.unshift(newNotification);
      localStorage.setItem(
        "hotel_notifications",
        JSON.stringify(notifications)
      );

      // Also store in the main client management data
      const clientData = JSON.parse(
        localStorage.getItem("clientManagementData") || "{}"
      );
      if (!clientData.notifications) clientData.notifications = [];
      clientData.notifications.unshift(newNotification);
      localStorage.setItem("clientManagementData", JSON.stringify(clientData));

      console.log("Sent booking notifications");
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  }

  /**
   * Get all recent bookings for admin dashboard
   */
  public async getRecentBookings(limit: number = 10) {
    try {
      const allBookings = await clientIntegrationService.getBookings();
      return allBookings
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit);
    } catch (error) {
      console.error("Error getting recent bookings:", error);
      return [];
    }
  }

  /**
   * Get booking statistics for admin dashboard
   */
  public async getBookingStatistics() {
    try {
      const allBookings = await clientIntegrationService.getBookings();
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const monthlyBookings = allBookings.filter(
        (b) => new Date(b.createdAt) >= thisMonth
      );
      const pendingBookings = allBookings.filter((b) => b.status === "pending");
      const confirmedBookings = allBookings.filter(
        (b) => b.status === "confirmed"
      );
      const activeBookings = allBookings.filter((b) => b.status === "active");

      return {
        totalBookings: allBookings.length,
        monthlyBookings: monthlyBookings.length,
        pendingBookings: pendingBookings.length,
        confirmedBookings: confirmedBookings.length,
        activeBookings: activeBookings.length,
        recentBookings: await this.getRecentBookings(5),
      };
    } catch (error) {
      console.error("Error getting booking statistics:", error);
      return {
        totalBookings: 0,
        monthlyBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        activeBookings: 0,
        recentBookings: [],
      };
    }
  }
}

// Export singleton instance
export const bookingIntegrationService =
  BookingIntegrationService.getInstance();
