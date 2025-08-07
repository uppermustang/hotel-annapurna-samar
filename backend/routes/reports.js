const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Get basic reports
router.get("/", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: "active" });
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });

    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get bookings by room type
    const roomTypeStats = await Booking.aggregate([
      {
        $group: {
          _id: "$roomType",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalBookings,
      activeBookings,
      pendingBookings,
      completedBookings,
      recentBookings,
      roomTypeStats,
    });
  } catch (error) {
    console.error("Error generating reports:", error);
    res.status(500).json({ message: "Failed to generate reports" });
  }
});

// Get bookings by date range
router.get("/date-range", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    const bookings = await Booking.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching date range reports:", error);
    res.status(500).json({ message: "Failed to fetch date range reports" });
  }
});

// Get revenue statistics (mock data for demo)
router.get("/revenue", async (req, res) => {
  try {
    // Mock revenue data - in real app, this would come from actual booking data
    const revenueData = {
      monthly: [
        { month: "Jan", revenue: 15000 },
        { month: "Feb", revenue: 18000 },
        { month: "Mar", revenue: 22000 },
        { month: "Apr", revenue: 25000 },
        { month: "May", revenue: 28000 },
        { month: "Jun", revenue: 32000 },
      ],
      totalRevenue: 140000,
      averageBookingValue: 280,
    };

    res.json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ message: "Failed to fetch revenue data" });
  }
});

module.exports = router;
