const express = require("express");
const router = express.Router();
const multer = require("multer");
const Media = require("../models/Media");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

// Upload files
router.post("/upload", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }));

    const media = await Media.insertMany(files);
    res.status(201).json(media);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload files" });
  }
});

// Get all media
router.get("/", async (req, res) => {
  try {
    const media = await Media.find().sort({ uploadedAt: -1 });
    res.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ message: "Failed to fetch media" });
  }
});

// Delete media
router.delete("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Delete file from filesystem
    if (fs.existsSync(media.path)) {
      fs.unlinkSync(media.path);
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ message: "Failed to delete media" });
  }
});

module.exports = router;
