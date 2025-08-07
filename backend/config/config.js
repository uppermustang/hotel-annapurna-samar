require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/hotel-annapurna-samar",
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production",
  NODE_ENV: process.env.NODE_ENV || "development"
};
