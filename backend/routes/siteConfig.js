const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Path to the site config JSON file
const configFilePath = path.join(__dirname, "../data/site-config.json");

// Ensure data directory exists
const dataDir = path.dirname(configFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default site configuration
const defaultConfig = {
  branding: {
    logo: "/himalayas-bg.jpg",
    textLogo: "🏔️ Hotel Annapurna Samar",
    favicon: "/favicon.ico",
    showLogo: true,
    showTextLogo: true,
    logoMaxHeight: 40,
    logoMaxWidth: 100
  },
  navigation: {
    items: [
      { id: "home", text: "Home", url: "/", order: 1, isActive: true },
      {
        id: "history",
        text: "History",
        url: "/history",
        order: 2,
        isActive: true,
      },
      { id: "blog", text: "Blog", url: "/blog", order: 3, isActive: true },
      { id: "rooms", text: "Rooms", url: "/rooms", order: 4, isActive: true },
      { id: "admin", text: "Admin", url: "/admin", order: 5, isActive: true },
    ],
  },
};

// Helper function to read config file
const readConfig = () => {
  try {
    if (fs.existsSync(configFilePath)) {
      const data = fs.readFileSync(configFilePath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading site config:", error);
  }
  return null;
};

// Helper function to write config file
const writeConfig = (config) => {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing site config:", error);
    return false;
  }
};

// GET /api/site-config - Retrieve site configuration
router.get("/", async (req, res) => {
  try {
    const config = readConfig();
    if (config) {
      res.json(config);
    } else {
      // If no config exists, create default and return it
      writeConfig(defaultConfig);
      res.json(defaultConfig);
    }
  } catch (error) {
    console.error("Error getting site config:", error);
    res.status(500).json({ message: "Failed to retrieve site configuration" });
  }
});

// POST /api/site-config - Create or update site configuration
router.post("/", async (req, res) => {
  try {
    const newConfig = req.body;

    // Validate the configuration structure
    if (!newConfig.branding || !newConfig.navigation) {
      return res.status(400).json({
        message:
          "Invalid configuration structure. Must include branding and navigation.",
      });
    }

    // Ensure required branding fields exist
    if (
      !newConfig.branding.logo ||
      !newConfig.branding.textLogo ||
      !newConfig.branding.favicon
    ) {
      return res.status(400).json({
        message:
          "Invalid branding configuration. Must include logo, textLogo, and favicon.",
      });
    }

    // Ensure navigation items exist and are valid
    if (
      !Array.isArray(newConfig.navigation.items) ||
      newConfig.navigation.items.length === 0
    ) {
      return res.status(400).json({
        message:
          "Invalid navigation configuration. Must include at least one navigation item.",
      });
    }

    // Validate each navigation item
    for (const item of newConfig.navigation.items) {
      if (
        !item.id ||
        !item.text ||
        !item.url ||
        typeof item.order !== "number" ||
        typeof item.isActive !== "boolean"
      ) {
        return res.status(400).json({
          message:
            "Invalid navigation item. Each item must have id, text, url, order, and isActive.",
        });
      }
    }

    // Ensure home item exists and is active
    const homeItem = newConfig.navigation.items.find(
      (item) => item.id === "home"
    );
    if (!homeItem) {
      return res.status(400).json({
        message: "Home navigation item is required and cannot be removed.",
      });
    }
    if (!homeItem.isActive) {
      return res.status(400).json({
        message: "Home navigation item must be active.",
      });
    }

    // Write the configuration to file
    const success = writeConfig(newConfig);
    if (success) {
      res.json({
        message: "Site configuration saved successfully",
        config: newConfig,
      });
    } else {
      res.status(500).json({ message: "Failed to save site configuration" });
    }
  } catch (error) {
    console.error("Error saving site config:", error);
    res.status(500).json({ message: "Failed to save site configuration" });
  }
});

// PUT /api/site-config - Update specific parts of site configuration
router.put("/", async (req, res) => {
  try {
    const updates = req.body;
    const currentConfig = readConfig() || defaultConfig;

    // Merge updates with current configuration
    const updatedConfig = {
      ...currentConfig,
      ...updates,
    };

    // Validate the updated configuration
    if (updatedConfig.branding) {
      if (
        !updatedConfig.branding.logo ||
        !updatedConfig.branding.textLogo ||
        !updatedConfig.branding.favicon
      ) {
        return res.status(400).json({
          message:
            "Invalid branding configuration. Must include logo, textLogo, and favicon.",
        });
      }
    }

    if (updatedConfig.navigation && updatedConfig.navigation.items) {
      if (
        !Array.isArray(updatedConfig.navigation.items) ||
        updatedConfig.navigation.items.length === 0
      ) {
        return res.status(400).json({
          message:
            "Invalid navigation configuration. Must include at least one navigation item.",
        });
      }

      // Validate navigation items
      for (const item of updatedConfig.navigation.items) {
        if (
          !item.id ||
          !item.text ||
          !item.url ||
          typeof item.order !== "number" ||
          typeof item.isActive !== "boolean"
        ) {
          return res.status(400).json({
            message:
              "Invalid navigation item. Each item must have id, text, url, order, and isActive.",
          });
        }
      }

      // Ensure home item exists and is active
      const homeItem = updatedConfig.navigation.items.find(
        (item) => item.id === "home"
      );
      if (!homeItem) {
        return res.status(400).json({
          message: "Home navigation item is required and cannot be removed.",
        });
      }
      if (!homeItem.isActive) {
        return res.status(400).json({
          message: "Home navigation item must be active.",
        });
      }
    }

    // Write the updated configuration
    const success = writeConfig(updatedConfig);
    if (success) {
      res.json({
        message: "Site configuration updated successfully",
        config: updatedConfig,
      });
    } else {
      res.status(500).json({ message: "Failed to update site configuration" });
    }
  } catch (error) {
    console.error("Error updating site config:", error);
    res.status(500).json({ message: "Failed to update site configuration" });
  }
});

// DELETE /api/site-config - Reset to default configuration
router.delete("/", async (req, res) => {
  try {
    const success = writeConfig(defaultConfig);
    if (success) {
      res.json({
        message: "Site configuration reset to defaults successfully",
        config: defaultConfig,
      });
    } else {
      res.status(500).json({ message: "Failed to reset site configuration" });
    }
  } catch (error) {
    console.error("Error resetting site config:", error);
    res.status(500).json({ message: "Failed to reset site configuration" });
  }
});

module.exports = router;
