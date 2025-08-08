const express = require("express");
const mongoose = require("mongoose");
const HomeContent = require("../models/HomeContent");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }
    const doc = await HomeContent.findOne().sort({ updatedAt: -1 });
    return res.json(doc || {});
  } catch (err) {
    console.error("Error fetching home content:", err);
    return res.status(500).json({ message: "Failed to fetch home content" });
  }
});

router.post("/", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }
    const payload = req.body || {};
    const saved = await HomeContent.findOneAndUpdate(
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
  } catch (err) {
    console.error("Error saving home content:", err);
    return res.status(500).json({ message: "Failed to save home content" });
  }
});

module.exports = router;
