// Client Management Type Definitions

export interface Guest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  preferences: {
    roomType: string;
    specialRequests?: string;
  };
  loyaltyPoints: number;
  totalBookings: number;
  totalSpent: number;
  lastVisit?: string; // Add lastVisit field for cross-component integration
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalGuests: number;
  activeBookings: number;
  monthlyRevenue: number;
  occupancyRate: number;
  averageRating: number;
  repeatGuests: number;
}

export interface GuestFilter {
  status?: 'all' | 'active' | 'inactive' | 'vip';
  roomType?: string;
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  searchTerm?: string;
}

export interface BookingFilter {
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  roomType?: string;
  guestEmail?: string;
}

export interface ClientManagementSettings {
  autoNotifications: boolean;
  dataRetentionDays: number;
  loyaltyProgramEnabled: boolean;
  vipThreshold: number;
  emailTemplates: {
    welcome: string;
    bookingConfirmation: string;
    checkInReminder: string;
    checkOutReminder: string;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  includeGuests: boolean;
  includeBookings: boolean;
  includeAnalytics: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ImportResult {
  success: boolean;
  message: string;
  importedGuests: number;
  importedBookings: number;
  errors: string[];
}
