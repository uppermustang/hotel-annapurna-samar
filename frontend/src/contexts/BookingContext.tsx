import React, { createContext, useContext, useState, ReactNode } from "react";

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: string;
  selectedRoom: string | null;
  step: "dates" | "rooms" | "confirmation";
  guestInfo: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests: string;
    arrivalTime: string;
  };
}

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  resetBookingData: () => void;
  goToStep: (step: BookingData["step"]) => void;
}

const defaultBookingData: BookingData = {
  checkIn: "",
  checkOut: "",
  guests: "2",
  selectedRoom: null,
  step: "dates",
  guestInfo: {
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
    arrivalTime: "",
  },
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({
  children,
}) => {
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    // Try to load from localStorage on initialization
    const saved = localStorage.getItem("bookingData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultBookingData;
      }
    }
    return defaultBookingData;
  });

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prevData) => {
      const newData = { ...prevData, ...data };

      // Save to localStorage
      localStorage.setItem("bookingData", JSON.stringify(newData));

      return newData;
    });
  };

  const resetBookingData = () => {
    setBookingData(defaultBookingData);
    localStorage.removeItem("bookingData");
  };

  const goToStep = (step: BookingData["step"]) => {
    setBookingData((prevData) => {
      // Preserve all existing data when changing steps
      const newData = { ...prevData, step };

      localStorage.setItem("bookingData", JSON.stringify(newData));

      return newData;
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updateBookingData,
        resetBookingData,
        goToStep,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
