import { useState, useEffect, useCallback } from 'react';
import { clientIntegrationService } from '../services/ClientIntegrationService';
import { Guest, Booking, Analytics, GuestFilter, BookingFilter } from '../types/client';

export const useClientManagement = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalGuests: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    averageRating: 0,
    repeatGuests: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
    
    // Subscribe to real-time updates
    const unsubscribeGuests = clientIntegrationService.subscribe('guests', (updatedGuests: Guest[]) => {
      setGuests(updatedGuests);
    });
    
    const unsubscribeBookings = clientIntegrationService.subscribe('bookings', (updatedBookings: Booking[]) => {
      setBookings(updatedBookings);
    });

    return () => {
      unsubscribeGuests();
      unsubscribeBookings();
    };
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [guestsData, bookingsData, analyticsData] = await Promise.all([
        clientIntegrationService.getGuests(),
        clientIntegrationService.getBookings(),
        clientIntegrationService.getAnalytics()
      ]);
      
      setGuests(guestsData);
      setBookings(bookingsData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Guest Management
  const addGuest = useCallback(async (guestData: Omit<Guest, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newGuest = await clientIntegrationService.addGuest(guestData);
      return { success: true, guest: newGuest };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add guest');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add guest' };
    }
  }, []);

  const updateGuest = useCallback(async (id: string, updates: Partial<Guest>) => {
    try {
      const updatedGuest = await clientIntegrationService.updateGuest(id, updates);
      return { success: true, guest: updatedGuest };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update guest');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update guest' };
    }
  }, []);

  const deleteGuest = useCallback(async (id: string) => {
    try {
      const success = await clientIntegrationService.deleteGuest(id);
      return { success };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete guest');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete guest' };
    }
  }, []);

  // Booking Management
  const addBooking = useCallback(async (bookingData: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newBooking = await clientIntegrationService.addBooking(bookingData);
      return { success: true, booking: newBooking };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add booking');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add booking' };
    }
  }, []);

  const updateBooking = useCallback(async (id: string, updates: Partial<Booking>) => {
    try {
      const updatedBooking = await clientIntegrationService.updateBooking(id, updates);
      return { success: true, booking: updatedBooking };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update booking' };
    }
  }, []);

  // Filtering and Search
  const filterGuests = useCallback((filters: GuestFilter) => {
    let filtered = [...guests];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(guest =>
        guest.name.toLowerCase().includes(term) ||
        guest.email.toLowerCase().includes(term) ||
        guest.phone.includes(term)
      );
    }

    if (filters.status && filters.status !== 'all') {
      switch (filters.status) {
        case 'active':
          filtered = filtered.filter(guest => guest.totalBookings > 0);
          break;
        case 'inactive':
          filtered = filtered.filter(guest => guest.totalBookings === 0);
          break;
        case 'vip':
          filtered = filtered.filter(guest => guest.loyaltyPoints > 1000);
          break;
      }
    }

    if (filters.roomType) {
      filtered = filtered.filter(guest => guest.preferences.roomType === filters.roomType);
    }

    if (filters.loyaltyTier) {
      const thresholds = {
        bronze: 0,
        silver: 500,
        gold: 1000,
        platinum: 2000
      };
      const threshold = thresholds[filters.loyaltyTier];
      filtered = filtered.filter(guest => guest.loyaltyPoints >= threshold);
    }

    return filtered;
  }, [guests]);

  const filterBookings = useCallback((filters: BookingFilter) => {
    let filtered = [...bookings];

    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    if (filters.roomType) {
      filtered = filtered.filter(booking => booking.roomType === filters.roomType);
    }

    if (filters.guestEmail) {
      filtered = filtered.filter(booking => 
        booking.guestEmail.toLowerCase().includes(filters.guestEmail!.toLowerCase())
      );
    }

    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filtered = filtered.filter(booking => {
        const checkIn = new Date(booking.checkIn);
        return checkIn >= start && checkIn <= end;
      });
    }

    return filtered;
  }, [bookings]);

  // Cross-component integration
  const getGuestsForRooms = useCallback(async () => {
    return await clientIntegrationService.getGuestsForRooms();
  }, []);

  const getGuestsForHero = useCallback(async () => {
    return await clientIntegrationService.getGuestsForHero();
  }, []);

  const getGuestsForGallery = useCallback(async () => {
    return await clientIntegrationService.getGuestsForGallery();
  }, []);

  // Export/Import
  const exportData = useCallback(async () => {
    try {
      return await clientIntegrationService.exportData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      return null;
    }
  }, []);

  const importData = useCallback(async (jsonData: string) => {
    try {
      const success = await clientIntegrationService.importData(jsonData);
      if (success) {
        await loadData(); // Reload data after import
      }
      return { success };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to import data' };
    }
  }, [loadData]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    guests,
    bookings,
    analytics,
    loading,
    error,
    
    // Actions
    loadData,
    addGuest,
    updateGuest,
    deleteGuest,
    addBooking,
    updateBooking,
    
    // Filtering
    filterGuests,
    filterBookings,
    
    // Cross-component integration
    getGuestsForRooms,
    getGuestsForHero,
    getGuestsForGallery,
    
    // Export/Import
    exportData,
    importData,
    
    // Utilities
    clearError
  };
};
