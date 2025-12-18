const express = require("express");
const router = express.Router();
const DatabaseVersion = require("../../database/models/DatabaseVersion");

// Get current database version
router.get("/current", async (req, res) => {
  try {
    const currentVersion = await DatabaseVersion.getLatestPublished();

    if (!currentVersion) {
      return res.json({
        version: "1.0.0",
        buildNumber: 1,
        isPublished: false,
        description: "Initial database version",
        changelog: ["Initial setup"],
        releaseDate: new Date(),
        minAppVersion: "1.0.0",
        dataStats: { words: 0, flashcards: 0, exams: 0, exercises: 0 },
      });
    }

    res.json({
      version: currentVersion.version,
      buildNumber: currentVersion.buildNumber,
      isPublished: currentVersion.isPublished,
      isForced: currentVersion.isForced,
      description: currentVersion.description,
      changelog: currentVersion.changelog,
      releaseDate: currentVersion.releaseDate,
      minAppVersion: currentVersion.minAppVersion,
      dataStats: currentVersion.dataStats,
    });
  } catch (error) {
    console.error("Error getting current database version:", error);
    res.status(500).json({ error: "Failed to get database version" });
  }
});

// Get all database versions
router.get("/all", async (req, res) => {
  try {
    const versions = await DatabaseVersion.find()
      .sort({ buildNumber: -1 })
      .select(
        "version buildNumber isPublished isForced description releaseDate dataStats"
      );

    res.json({ versions });
  } catch (error) {
    console.error("Error getting database versions:", error);
    res.status(500).json({ error: "Failed to get database versions" });
  }
});

// Create new database version
router.post("/create", async (req, res) => {
  try {
    const {
      version,
      buildNumber,
      description,
      changelog,
      minAppVersion,
      dataStats,
    } = req.body;

    // Validate required fields
    if (!version || !buildNumber || !description || !minAppVersion) {
      return res.status(400).json({
        error:
          "Missing required fields: version, buildNumber, description, minAppVersion",
      });
    }

    // Check if version already exists
    const existingVersion = await DatabaseVersion.findOne({ version });
    if (existingVersion) {
      return res.status(400).json({ error: "Version already exists" });
    }

    // Check if build number already exists
    const existingBuild = await DatabaseVersion.findOne({ buildNumber });
    if (existingBuild) {
      return res.status(400).json({ error: "Build number already exists" });
    }

    // Create new version
    const newVersion = new DatabaseVersion({
      version,
      buildNumber,
      description,
      changelog: changelog || [],
      minAppVersion,
      dataStats: dataStats || {
        words: 0,
        flashcards: 0,
        exams: 0,
        exercises: 0,
      },
      isPublished: false, // Default to unpublished
      isForced: false,
    });

    await newVersion.save();

    res.json({
      message: "Database version created successfully",
      version: {
        id: newVersion._id,
        version: newVersion.version,
        buildNumber: newVersion.buildNumber,
        isPublished: newVersion.isPublished,
        isForced: newVersion.isForced,
        description: newVersion.description,
        changelog: newVersion.changelog,
        releaseDate: newVersion.releaseDate,
        minAppVersion: newVersion.minAppVersion,
        dataStats: newVersion.dataStats,
      },
    });
  } catch (error) {
    console.error("Error creating database version:", error);
    res.status(500).json({ error: "Failed to create database version" });
  }
});

// Publish database version
router.post("/publish/:versionId", async (req, res) => {
  try {
    const { versionId } = req.params;
    const { isForced = false } = req.body;

    const version = await DatabaseVersion.findById(versionId);
    if (!version) {
      return res.status(404).json({ error: "Database version not found" });
    }

    // Unpublish all other versions (only one should be published at a time)
    await DatabaseVersion.updateMany({}, { isPublished: false });

    // Publish this version
    version.isPublished = true;
    version.isForced = isForced;
    version.releaseDate = new Date();
    await version.save();

    res.json({
      message: "Database version published successfully",
      version: {
        id: version._id,
        version: version.version,
        buildNumber: version.buildNumber,
        isPublished: version.isPublished,
        isForced: version.isForced,
        description: version.description,
        changelog: version.changelog,
        releaseDate: version.releaseDate,
        minAppVersion: version.minAppVersion,
        dataStats: version.dataStats,
      },
    });
  } catch (error) {
    console.error("Error publishing database version:", error);
    res.status(500).json({ error: "Failed to publish database version" });
  }
});

// Check for updates (for app to call)
router.get("/check-update/:currentVersion", async (req, res) => {
  try {
    const { currentVersion } = req.params;
    const { appVersion } = req.query; // Optional: current app version

    // Get latest published version
    const latestVersion = await DatabaseVersion.getLatestPublished();

    if (!latestVersion) {
      return res.json({
        hasUpdate: false,
        reason: "No published version available",
      });
    }

    // Compare versions
    const versionCompare = DatabaseVersion.compareVersions(
      currentVersion,
      latestVersion.version
    );
    const hasUpdate = versionCompare < 0; // Current version is less than latest

    // Check if app version meets minimum requirements
    let appVersionCompatible = true;
    if (appVersion && latestVersion.minAppVersion) {
      appVersionCompatible =
        DatabaseVersion.compareVersions(
          appVersion,
          latestVersion.minAppVersion
        ) >= 0;
    }

    res.json({
      hasUpdate: hasUpdate && appVersionCompatible,
      isForced: latestVersion.isForced,
      currentVersion,
      latestVersion: {
        version: latestVersion.version,
        buildNumber: latestVersion.buildNumber,
        description: latestVersion.description,
        changelog: latestVersion.changelog,
        releaseDate: latestVersion.releaseDate,
        minAppVersion: latestVersion.minAppVersion,
        dataStats: latestVersion.dataStats,
      },
      appVersionCompatible,
      reason: !hasUpdate
        ? "Already up to date"
        : !appVersionCompatible
        ? "App update required"
        : "New version available",
    });
  } catch (error) {
    console.error("Error checking for updates:", error);
    res.status(500).json({ error: "Failed to check for updates" });
  }
});

module.exports = router;
