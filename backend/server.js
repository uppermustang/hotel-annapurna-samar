require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const mediaRoutes = require("./routes/media");
const bookingsRoutes = require("./routes/bookings");
const reportsRoutes = require("./routes/reports");
const heroContentRoutes = require("./routes/heroContent");
const homeContentRoutes = require("./routes/homeContent");

const app = express();

// Connect to database
connectDB();

// Middleware
// Ensure uploads directory exists (multer does not create it automatically)
const fs = require("fs");
const path = require("path");
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/hero", heroContentRoutes);
app.use("/api/home", homeContentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(config.PORT, () =>
  console.log(`Server running on port ${config.PORT}`)
);
