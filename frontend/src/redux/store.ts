import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./slices/bookingSlice";
import mediaReducer from "./slices/mediaSlice";

export const store = configureStore({
  reducer: {
    bookings: bookingReducer,
    media: mediaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
