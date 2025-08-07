const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    minlength: [10, "Content must be at least 10 characters long"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    default: "Admin",
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  featuredImage: {
    type: String,
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
blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
