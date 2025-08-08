const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const HeroContent = require("../models/HeroContent");

// Get hero content
router.get("/", async (req, res) => {
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    // Get the most recent hero content
    const heroContent = await HeroContent.findOne().sort({ updatedAt: -1 });
    res.json(heroContent || {});
  } catch (error) {
    console.error("Error fetching hero content:", error);
    res.status(500).json({ message: "Failed to fetch hero content" });
  }
});

// Save hero content
router.post("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }

    const payload = req.body || {};
    const requiredFields = [
      { key: "title", name: "Title" },
      { key: "mainDescription", name: "Main Description" },
      { key: "tagline", name: "Tagline" },
      { key: "callToAction", name: "Call To Action" },
      { key: "backgroundImage", name: "Background Image" },
    ];

    for (const field of requiredFields) {
      const value = payload[field.key];
      if (typeof value !== "string" || value.trim().length === 0) {
        return res.status(400).json({ message: `${field.name} is required` });
      }
      payload[field.key] = value.trim();
    }

    // Upsert a single hero content document (create if none, otherwise update the latest)
    const saved = await HeroContent.findOneAndUpdate(
      {},
      { ...payload, updatedAt: new Date() },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json(saved);
  } catch (error) {
    console.error("Error saving hero content:", error);
    // Surface validation errors clearly
    if (error && error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to save hero content" });
  }
});

module.exports = router;
