const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple authentication for demo (replace with proper user validation)
    if (username === "admin" && password === "admin123") {
      const token = jwt.sign({ userId: "admin", username }, config.JWT_SECRET, {
        expiresIn: "24h",
      });
      res.json({
        message: "Logged in successfully",
        token,
        user: { username, role: "admin" },
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
