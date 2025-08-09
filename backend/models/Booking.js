const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: [true, "Guest name is required"],
    trim: true,
    maxlength: [100, "Guest name cannot exceed 100 characters"],
  },
  checkIn: {
    type: Date,
    required: [true, "Check-in date is required"],
  },
  checkOut: {
    type: Date,
    required: [true, "Check-out date is required"],
  },
  roomType: {
    type: String,
    required: [true, "Room type is required"],
    trim: true,
  },
  guests: { type: Number, default: 2, min: 1 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "active", "completed", "cancelled"],
    default: "pending",
  },
  guestEmail: {
    type: String,
    required: [true, "Guest email is required"],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  guestPhone: {
    type: String,
    required: [true, "Guest phone is required"],
  },
  specialRequests: {
    type: String,
    maxlength: [500, "Special requests cannot exceed 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
bookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
