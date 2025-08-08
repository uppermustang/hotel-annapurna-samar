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
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }
    
    const newHeroContent = new HeroContent(req.body);
    await newHeroContent.save();
    res.status(201).json(newHeroContent);
  } catch (error) {
    console.error("Error saving hero content:", error);
    res.status(500).json({ message: "Failed to save hero content" });
  }
});

module.exports = router;
