import { Guest, Booking } from "../types/client";

// Service for integrating client management across different components
export class ClientIntegrationService {
  private static instance: ClientIntegrationService;
  private guests: Guest[] = [];
  private bookings: Booking[] = [];
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    // Initialize with sample data if localStorage is empty
    if (!localStorage.getItem('clientManagementData')) {
      const sampleData = {
        guests: [
          {
            _id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1-555-0123',
            address: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              country: 'USA',
              zipCode: '10001'
            },
            preferences: {
              roomType: 'Deluxe',
              specialRequests: 'Mountain view preferred'
            },
            loyaltyPoints: 1250,
            totalBookings: 8,
            totalSpent: 3200,
            lastVisit: '2024-01-15T10:30:00Z',
            createdAt: '2023-06-15T09:00:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1-555-0456',
            address: {
              street: '456 Oak Ave',
              city: 'Los Angeles',
              state: 'CA',
              country: 'USA',
              zipCode: '90210'
            },
            preferences: {
              roomType: 'Suite',
              specialRequests: 'High floor, quiet room'
            },
            loyaltyPoints: 2100,
            totalBookings: 12,
            totalSpent: 5400,
            lastVisit: '2024-01-20T14:15:00Z',
            createdAt: '2023-03-10T11:30:00Z',
            updatedAt: '2024-01-20T14:15:00Z'
          }
        ],
        bookings: [
          {
            _id: '1',
            guestName: 'John Doe',
            guestEmail: 'john.doe@example.com',
            guestPhone: '+1-555-0123',
            checkIn: '2024-02-01T15:00:00Z',
            checkOut: '2024-02-03T11:00:00Z',
            roomType: 'Deluxe',
            guests: 2,
            status: 'confirmed' as const,
            specialRequests: 'Mountain view preferred',
            createdAt: '2024-01-25T10:00:00Z',
            updatedAt: '2024-01-25T10:00:00Z'
          },
          {
            _id: '2',
            guestName: 'Jane Smith',
            guestEmail: 'jane.smith@example.com',
            guestPhone: '+1-555-0456',
            checkIn: '2024-02-05T15:00:00Z',
            checkOut: '2024-02-07T11:00:00Z',
            roomType: 'Suite',
            guests: 1,
            status: 'pending' as const,
            specialRequests: 'High floor, quiet room',
            createdAt: '2024-01-28T09:15:00Z',
            updatedAt: '2024-01-28T09:15:00Z'
          }
        ]
      };
      
      localStorage.setItem('clientManagementData', JSON.stringify(sampleData));
      this.guests = sampleData.guests;
      this.bookings = sampleData.bookings;
    } else {
      this.loadFromStorage();
    }
  }

  public static getInstance(): ClientIntegrationService {
    if (!ClientIntegrationService.instance) {
      ClientIntegrationService.instance = new ClientIntegrationService();
    }
    return ClientIntegrationService.instance;
  }

  // Load data from localStorage
  private loadFromStorage() {
    try {
      const savedData = localStorage.getItem('clientManagementData');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.guests = data.guests || [];
        this.bookings = data.bookings || [];
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  // Save data to localStorage
  private saveData() {
    try {
      localStorage.setItem("hotel_guests", JSON.stringify(this.guests));
      localStorage.setItem("hotel_bookings", JSON.stringify(this.bookings));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  // Guest Management Methods
  public async getGuests(): Promise<Guest[]> {
    return [...this.guests];
  }

  public async getGuestById(id: string): Promise<Guest | null> {
    return this.guests.find((guest) => guest._id === id) || null;
  }

  public async addGuest(
    guestData: Omit<Guest, "_id" | "createdAt" | "updatedAt">
  ): Promise<Guest> {
    const newGuest: Guest = {
      ...guestData,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalBookings: 0,
      totalSpent: 0,
      lastVisit: new Date().toISOString(),
    };

    this.guests.push(newGuest);
    this.saveData();
    this.notifyListeners("guests", this.guests);

    return newGuest;
  }

  public async updateGuest(
    id: string,
    updates: Partial<Guest>
  ): Promise<Guest | null> {
    const index = this.guests.findIndex((guest) => guest._id === id);
    if (index === -1) return null;

    this.guests[index] = {
      ...this.guests[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveData();
    this.notifyListeners("guests", this.guests);

    return this.guests[index];
  }

  public async deleteGuest(id: string): Promise<boolean> {
    const index = this.guests.findIndex((guest) => guest._id === id);
    if (index === -1) return false;

    this.guests.splice(index, 1);
    this.saveData();
    this.notifyListeners("guests", this.guests);

    return true;
  }

  // Booking Management Methods
  public async getBookings(): Promise<Booking[]> {
    return [...this.bookings];
  }

  public async getBookingsByGuestId(guestId: string): Promise<Booking[]> {
    return this.bookings.filter(
      (booking) =>
        booking.guestEmail === this.guests.find((g) => g._id === guestId)?.email
    );
  }

  public async addBooking(
    bookingData: Omit<Booking, "_id" | "createdAt" | "updatedAt">
  ): Promise<Booking> {
    const newBooking: Booking = {
      ...bookingData,
      _id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.bookings.push(newBooking);

    // Update guest statistics
    const guest = this.guests.find((g) => g.email === bookingData.guestEmail);
    if (guest) {
      await this.updateGuest(guest._id, {
        totalBookings: guest.totalBookings + 1,
        lastVisit: new Date().toISOString(),
      });
    }

    this.saveData();
    this.notifyListeners("bookings", this.bookings);

    return newBooking;
  }

  public async updateBooking(
    id: string,
    updates: Partial<Booking>
  ): Promise<Booking | null> {
    const index = this.bookings.findIndex((booking) => booking._id === id);
    if (index === -1) return null;

    this.bookings[index] = {
      ...this.bookings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveData();
    this.notifyListeners("bookings", this.bookings);

    return this.bookings[index];
  }

  // Analytics Methods
  public async getAnalytics() {
    const totalGuests = this.guests.length;
    const activeBookings = this.bookings.filter((b) =>
      ["confirmed", "active"].includes(b.status)
    ).length;

    const monthlyRevenue = this.calculateMonthlyRevenue();
    const occupancyRate = this.calculateOccupancyRate();
    const averageRating = this.calculateAverageRating();
    const repeatGuests = this.guests.filter((g) => g.totalBookings > 1).length;

    return {
      totalGuests,
      activeBookings,
      monthlyRevenue,
      occupancyRate,
      averageRating,
      repeatGuests,
    };
  }

  // Cross-Component Integration Methods
  getGuestsForRooms(): Guest[] {
    // Return guests with room preferences and recent activity
    return this.guests
      .filter((guest) => guest.preferences?.roomType || guest.lastVisit)
      .sort((a, b) => {
        // Sort by loyalty points first, then by last visit
        const aPoints = a.loyaltyPoints || 0;
        const bPoints = b.loyaltyPoints || 0;
        if (aPoints !== bPoints) return bPoints - aPoints;

        if (a.lastVisit && b.lastVisit) {
          return (
            new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
          );
        }
        return 0;
      });
  }

  getGuestsForHero(): Guest[] {
    // Return VIP guests and recent visitors for hero section
    return this.guests
      .filter(
        (guest) =>
          (guest.loyaltyPoints && guest.loyaltyPoints > 1000) ||
          (guest.lastVisit && this.isRecentVisit(guest.lastVisit))
      )
      .sort((a, b) => {
        // Sort by VIP status first, then by last visit
        const aVIP = (a.loyaltyPoints || 0) > 1000;
        const bVIP = (b.loyaltyPoints || 0) > 1000;
        if (aVIP !== bVIP) return aVIP ? -1 : 1;

        if (a.lastVisit && b.lastVisit) {
          return (
            new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
          );
        }
        return 0;
      });
  }

  getGuestsForGallery(): Guest[] {
    // Return guests who have uploaded media or are VIP members
    return this.guests
      .filter((guest) => guest.loyaltyPoints && guest.loyaltyPoints > 1000)
      .sort((a, b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0));
  }

  private isRecentVisit(lastVisit: string): boolean {
    const visitDate = new Date(lastVisit);
    const now = new Date();
    const daysDiff =
      (now.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30; // Consider visits within 30 days as recent
  }

  // Event Listener System for Real-time Updates
  public subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private calculateMonthlyRevenue(): number {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return this.bookings
      .filter((booking) => new Date(booking.createdAt) >= monthStart)
      .reduce((total, booking) => {
        // Mock revenue calculation - replace with actual pricing logic
        const basePrice = this.getRoomBasePrice(booking.roomType);
        const nights = this.calculateNights(booking.checkIn, booking.checkOut);
        return total + basePrice * nights;
      }, 0);
  }

  private calculateOccupancyRate(): number {
    // Mock occupancy calculation - replace with actual room inventory logic
    const totalRooms = 50; // Mock total rooms
    const occupiedRooms = this.bookings.filter((b) =>
      ["confirmed", "active"].includes(b.status)
    ).length;

    return Math.round((occupiedRooms / totalRooms) * 100);
  }

  private calculateAverageRating(): number {
    // Mock rating calculation - replace with actual rating system
    return 4.6;
  }

  private getRoomBasePrice(roomType: string): number {
    const prices: { [key: string]: number } = {
      Standard: 100,
      Deluxe: 150,
      Suite: 250,
      Presidential: 500,
    };
    return prices[roomType] || 100;
  }

  private calculateNights(checkIn: string, checkOut: string): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Export/Import Methods
  public async exportData(): Promise<string> {
    const data = {
      guests: this.guests,
      bookings: this.bookings,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  public async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      if (data.guests && data.bookings) {
        this.guests = data.guests;
        this.bookings = data.bookings;
        this.saveData();
        this.notifyListeners("guests", this.guests);
        this.notifyListeners("bookings", this.bookings);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }
}

// Export singleton instance
export const clientIntegrationService = ClientIntegrationService.getInstance();
