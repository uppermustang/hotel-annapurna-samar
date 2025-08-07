import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Booking {
  _id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  status: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reports {
  totalBookings: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  recentBookings: Booking[];
  roomTypeStats: { _id: string; count: number }[];
}

interface BookingState {
  bookings: Booking[];
  reports: Reports;
  loading: boolean;
  error: string | null;
}

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/bookings");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchReports = createAsyncThunk(
  "bookings/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/reports");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const initialState: BookingState = {
  bookings: [],
  reports: {
    totalBookings: 0,
    activeBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    roomTypeStats: [],
  },
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReports.fulfilled,
        (state, action: PayloadAction<Reports>) => {
          state.loading = false;
          state.reports = action.payload;
        }
      )
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default bookingSlice.reducer;
