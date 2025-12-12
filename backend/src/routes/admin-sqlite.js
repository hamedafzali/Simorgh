const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs").promises;
const SQLiteGenerator = require("../../admin/src/scripts/sqlite-generator");

// Generate SQLite database
router.post("/database/generate-sqlite", async (req, res) => {
  try {
    const generator = new SQLiteGenerator();
    const stats = await generator.generateDatabase();

    res.json({
      success: true,
      message: "SQLite database generated successfully",
      stats,
    });
  } catch (error) {
    console.error("SQLite generation error:", error);
    res.status(500).json({
      error: "Failed to generate SQLite database",
      details: error.message,
    });
  }
});

// Get SQLite database stats
router.get("/database/sqlite-stats", async (req, res) => {
  try {
    const sqlitePath = path.join(
      __dirname,
      "../../admin/dist/sqlite/simorgh_app.db"
    );
    const packagePath = path.join(
      __dirname,
      "../../admin/dist/sqlite/simorgh-app-package.json"
    );

    let stats = { exams: 0, flashcards: 0, words: 0 };
    let version = { version: "1.0.0", timestamp: null };
    let packageSize = 0;

    // Check if database exists
    try {
      const db = require("sqlite3").Database;
      const dbInstance = new db(sqlitePath);

      const queries = [
        "SELECT COUNT(*) as count FROM exams",
        "SELECT COUNT(*) as count FROM flashcards",
        "SELECT COUNT(*) as count FROM words",
      ];

      for (let i = 0; i < queries.length; i++) {
        await new Promise((resolve, reject) => {
          dbInstance.get(queries[i], (err, row) => {
            if (err) reject(err);
            else {
              if (i === 0) stats.exams = row.count;
              else if (i === 1) stats.flashcards = row.count;
              else if (i === 2) stats.words = row.count;
              resolve();
            }
          });
        });
      }

      // Get version info
      await new Promise((resolve, reject) => {
        dbInstance.get(
          "SELECT * FROM database_version WHERE id = 1",
          (err, row) => {
            if (err) reject(err);
            else if (row) {
              version = {
                version: row.version,
                timestamp: row.timestamp,
                description: row.description,
              };
            }
            resolve();
          }
        );
      });

      dbInstance.close();
    } catch (error) {
      console.log("SQLite database not found or not accessible");
    }

    // Check package info
    try {
      const packageData = await fs.readFile(packagePath, "utf8");
      const packageInfo = JSON.parse(packageData);
      packageSize = packageInfo.packageSize || 0;
    } catch (error) {
      // Package not created yet
    }

    res.json({
      success: true,
      stats,
      version,
      packageSize,
      databaseExists: stats.exams > 0,
    });
  } catch (error) {
    console.error("SQLite stats error:", error);
    res.status(500).json({
      error: "Failed to get SQLite database stats",
      details: error.message,
    });
  }
});

// Package SQLite database
router.post("/database/package-sqlite", async (req, res) => {
  try {
    const generator = new SQLiteGenerator();
    const packageInfo = await generator.packageDatabase();

    res.json({
      success: true,
      message: "SQLite database packaged successfully",
      packageInfo,
    });
  } catch (error) {
    console.error("SQLite packaging error:", error);
    res.status(500).json({
      error: "Failed to package SQLite database",
      details: error.message,
    });
  }
});

// Download SQLite database
router.get("/database/download-sqlite", async (req, res) => {
  try {
    const sqlitePath = path.join(
      __dirname,
      "../../admin/dist/sqlite/simorgh_app.db"
    );

    // Check if file exists
    try {
      await fs.access(sqlitePath);
    } catch (error) {
      return res.status(404).json({ error: "SQLite database not found" });
    }

    // Set headers for file download
    res.setHeader("Content-Type", "application/x-sqlite3");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="simorgh-app-sqlite.db"'
    );

    // Stream the file
    const fileStream = require("fs").createReadStream(sqlitePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("SQLite download error:", error);
    res.status(500).json({
      error: "Failed to download SQLite database",
      details: error.message,
    });
  }
});

// Download SQLite package
router.get("/database/download-package", async (req, res) => {
  try {
    const packagePath = path.join(
      __dirname,
      "../../admin/dist/sqlite/simorgh-app-package.json"
    );

    // Check if file exists
    try {
      await fs.access(packagePath);
    } catch (error) {
      return res.status(404).json({ error: "SQLite package not found" });
    }

    // Set headers for file download
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="simorgh-app-package.json"'
    );

    // Stream the file
    const fileStream = require("fs").createReadStream(packagePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Package download error:", error);
    res.status(500).json({
      error: "Failed to download SQLite package",
      details: error.message,
    });
  }
});

module.exports = router;
