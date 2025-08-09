const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// Create new booking
router.post("/", async (req, res) => {
  try {
    const {
      guestName,
      checkIn,
      checkOut,
      roomType,
      guestEmail,
      guestPhone,
      guests,
      specialRequests,
    } = req.body;

    // Basic validation
    if (
      !guestName ||
      !checkIn ||
      !checkOut ||
      !roomType ||
      !guestEmail ||
      !guestPhone
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = new Booking({
      guestName,
      checkIn,
      checkOut,
      roomType,
      guestEmail,
      guestPhone,
      guests,
      specialRequests,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

// Update booking status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Failed to update booking" });
  }
});

// Delete booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
});

module.exports = router;
