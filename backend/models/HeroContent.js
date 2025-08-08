const mongoose = require("mongoose");

const heroContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  mainDescription: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  callToAction: {
    type: String,
    required: true,
  },
  backgroundImage: {
    type: String,
    required: true,
  },
  benefits: [
    {
      id: String,
      icon: String,
      title: String,
      description: String,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HeroContent", heroContentSchema);
