const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, "Filename is required"]
  },
  path: {
    type: String,
    required: [true, "File path is required"]
  },
  originalName: {
    type: String,
    required: [true, "Original filename is required"]
  },
  size: {
    type: Number,
    required: [true, "File size is required"]
  },
  mimetype: {
    type: String,
    required: [true, "MIME type is required"]
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    maxlength: [200, "Description cannot exceed 200 characters"]
  },
  category: {
    type: String,
    enum: ["gallery", "rooms", "amenities", "events", "other"],
    default: "other"
  }
});

module.exports = mongoose.model("Media", mediaSchema);
