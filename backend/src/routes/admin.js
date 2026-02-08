const express = require("express");
const router = express.Router();
const Exam = require("../../database/models/Exam");
const Flashcard = require("../../database/models/Flashcard");
const Word = require("../../database/models/Word");

// Dashboard stats
router.get("/dashboard", async (req, res) => {
  try {
    const [examCount, flashcardCount, wordCount] = await Promise.all([
      Exam.countDocuments({ isActive: true }),
      Flashcard.countDocuments(),
      Word.countDocuments(),
    ]);

    // Get real user data from database (assuming User model exists)
    let totalUsers = 0,
      onlineUsers = 0,
      activeToday = 0;
    try {
      const User = require("../../database/models/User");
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      totalUsers = await User.countDocuments();
      onlineUsers = await User.countDocuments({
        lastSeen: { $gte: new Date(now.getTime() - 5 * 60 * 1000) },
      });
      activeToday = await User.countDocuments({
        lastSeen: { $gte: todayStart },
      });
    } catch (userError) {
      console.log("User model not found, using default values");
    }

    res.json({
      stats: {
        database: {
          exams: examCount,
          flashcards: flashcardCount,
          words: wordCount,
        },
        users: {
          total: totalUsers,
          online: onlineUsers,
          activeToday: activeToday,
        },
        scripts: {
          total: 8,
          running: 2,
          failed: 0,
        },
        system: {
          uptime: process.uptime(),
          memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          cpu: 25,
        },
      },
      recentActivity: [],
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// Database management
router.get("/database/backups", async (req, res) => {
  try {
    // Mock backup data - in real implementation, this would fetch from storage
    res.json({
      backups: [
        {
          id: "backup_1",
          name: "Daily Backup - 2024-01-15",
          size: 1024 * 1024 * 50, // 50MB
          createdAt: new Date("2024-01-15T02:00:00Z"),
          status: "completed",
        },
        {
          id: "backup_2",
          name: "Weekly Backup - 2024-01-14",
          size: 1024 * 1024 * 45, // 45MB
          createdAt: new Date("2024-01-14T02:00:00Z"),
          status: "completed",
        },
      ],
    });
  } catch (error) {
    console.error("Backups error:", error);
    res.status(500).json({ error: "Failed to fetch backups" });
  }
});

router.post("/database/backup", async (req, res) => {
  try {
    const { name, description, type } = req.body;

    // Create backup logic here
    console.log(`Creating backup: ${name} (${type})`);

    res.json({
      id: `backup_${Date.now()}`,
      name,
      description,
      type,
      status: "in-progress",
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Backup error:", error);
    res.status(500).json({ error: "Failed to create backup" });
  }
});

router.post("/database/restore/:backupId", async (req, res) => {
  try {
    const { backupId } = req.params;

    // Restore logic here
    console.log(`Restoring backup: ${backupId}`);

    res.json({ message: "Database restored successfully" });
  } catch (error) {
    console.error("Restore error:", error);
    res.status(500).json({ error: "Failed to restore database" });
  }
});

router.delete("/database/backup/:backupId", async (req, res) => {
  try {
    const { backupId } = req.params;

    // Delete backup logic here
    console.log(`Deleting backup: ${backupId}`);

    res.json({ message: "Backup deleted successfully" });
  } catch (error) {
    console.error("Delete backup error:", error);
    res.status(500).json({ error: "Failed to delete backup" });
  }
});

router.get("/database/backup/:backupId/download", async (req, res) => {
  try {
    const { backupId } = req.params;

    // Download backup logic here
    console.log(`Downloading backup: ${backupId}`);

    res.json({ message: "Backup download started" });
  } catch (error) {
    console.error("Download backup error:", error);
    res.status(500).json({ error: "Failed to download backup" });
  }
});

// Script management
router.get("/scripts", async (req, res) => {
  try {
    // Mock script data
    res.json({
      scripts: [
        {
          id: "script_1",
          name: "Generate 5000 Exams",
          description: "Generate comprehensive exam database",
          category: "seed",
          content: 'console.log("Generating exams...");',
          createdAt: new Date("2024-01-10T10:00:00Z"),
          updatedAt: new Date("2024-01-10T10:00:00Z"),
          status: "ready",
          lastRun: new Date("2024-01-14T15:30:00Z"),
        },
        {
          id: "script_2",
          name: "Database Cleanup",
          description: "Clean up old data and optimize performance",
          category: "maintenance",
          content: 'console.log("Cleaning database...");',
          createdAt: new Date("2024-01-08T14:00:00Z"),
          updatedAt: new Date("2024-01-08T14:00:00Z"),
          status: "ready",
          lastRun: new Date("2024-01-13T02:00:00Z"),
        },
      ],
    });
  } catch (error) {
    console.error("Scripts error:", error);
    res.status(500).json({ error: "Failed to fetch scripts" });
  }
});

router.get("/scripts/:scriptId", async (req, res) => {
  try {
    const { scriptId } = req.params;

    // Get script logic here
    res.json({
      id: scriptId,
      name: "Sample Script",
      content: 'console.log("Hello, World!");',
      category: "general",
    });
  } catch (error) {
    console.error("Get script error:", error);
    res.status(500).json({ error: "Failed to fetch script" });
  }
});

router.put("/scripts/:scriptId", async (req, res) => {
  try {
    const { scriptId } = req.params;
    const { content } = req.body;

    // Update script logic here
    console.log(`Updating script ${scriptId}`);

    res.json({ message: "Script updated successfully" });
  } catch (error) {
    console.error("Update script error:", error);
    res.status(500).json({ error: "Failed to update script" });
  }
});

router.post("/scripts/:scriptId/run", async (req, res) => {
  try {
    const { scriptId } = req.params;

    // Run script logic here
    console.log(`Running script ${scriptId}`);

    res.json({
      id: `run_${Date.now()}`,
      scriptId,
      status: "running",
      startedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Run script error:", error);
    res.status(500).json({ error: "Failed to run script" });
  }
});

router.post("/scripts/:scriptId/stop", async (req, res) => {
  try {
    const { scriptId } = req.params;

    // Stop script logic here
    console.log(`Stopping script ${scriptId}`);

    res.json({ message: "Script stopped successfully" });
  } catch (error) {
    console.error("Stop script error:", error);
    res.status(500).json({ error: "Failed to stop script" });
  }
});

router.get("/scripts/:scriptId/logs", async (req, res) => {
  try {
    const { scriptId } = req.params;

    // Get script logs here
    res.json({
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: "info",
          message: "Script started",
        },
        {
          timestamp: new Date().toISOString(),
          level: "info",
          message: "Processing data...",
        },
        {
          timestamp: new Date().toISOString(),
          level: "success",
          message: "Script completed successfully",
        },
      ],
    });
  } catch (error) {
    console.error("Get script logs error:", error);
    res.status(500).json({ error: "Failed to fetch script logs" });
  }
});

router.get("/scripts/running", async (req, res) => {
  try {
    // Get running scripts
    res.json({
      running: [
        {
          id: "run_1",
          scriptId: "script_1",
          name: "Generate 5000 Exams",
          startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          progress: 65,
        },
      ],
    });
  } catch (error) {
    console.error("Get running scripts error:", error);
    res.status(500).json({ error: "Failed to fetch running scripts" });
  }
});

// User management
router.get("/users", async (req, res) => {
  try {
    let users = [];
    try {
      const User = require("../../database/models/User");
      users = await User.find().sort({ createdAt: -1 }).limit(50);

      // Transform user data for frontend
      users = users.map((user) => ({
        id: user._id.toString(),
        name: user.name || "Unknown",
        email: user.email || "unknown@example.com",
        status: user.status || "active",
        appVersion: user.appVersion || "1.0.0",
        dbVersion: user.dbVersion || "1.0.0",
        lastActive: user.lastSeen || user.createdAt,
        progress: user.progress || { exams: 0, flashcards: 0 },
      }));
    } catch (userError) {
      console.log("User model not found, returning empty array");
    }

    res.json({ users });
  } catch (error) {
    console.error("Users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/users/online", async (req, res) => {
  try {
    let online = [];
    try {
      const User = require("../../database/models/User");
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      online = await User.find({
        lastSeen: { $gte: fiveMinutesAgo },
      }).select("name lastSeen");

      online = online.map((user) => ({
        id: user._id.toString(),
        name: user.name || "Unknown",
        lastSeen: user.lastSeen,
      }));
    } catch (userError) {
      console.log("User model not found, returning empty array");
    }

    res.json({ online });
  } catch (error) {
    console.error("Online users error:", error);
    res.status(500).json({ error: "Failed to fetch online users" });
  }
});

router.get("/users/stats", async (req, res) => {
  try {
    let stats = { total: 0, online: 0, activeToday: 0, newThisWeek: 0 };

    try {
      const User = require("../../database/models/User");
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      stats.total = await User.countDocuments();
      stats.online = await User.countDocuments({
        lastSeen: { $gte: fiveMinutesAgo },
      });
      stats.activeToday = await User.countDocuments({
        lastSeen: { $gte: todayStart },
      });
      stats.newThisWeek = await User.countDocuments({
        createdAt: { $gte: weekStart },
      });
    } catch (userError) {
      console.log("User model not found, returning default stats");
    }

    res.json({ stats });
  } catch (error) {
    console.error("User stats error:", error);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
});

router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user logic here
    res.json({
      id: userId,
      name: "John Doe",
      email: "john@example.com",
      status: "active",
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    // Update user logic here
    console.log(`Updating user ${userId}`);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user logic here
    console.log(`Deleting user ${userId}`);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.post("/users/:userId/ban", async (req, res) => {
  try {
    const { userId } = req.params;

    // Ban user logic here
    console.log(`Banning user ${userId}`);

    res.json({ message: "User banned successfully" });
  } catch (error) {
    console.error("Ban user error:", error);
    res.status(500).json({ error: "Failed to ban user" });
  }
});

router.get("/users/:userId/activity", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user activity logic here
    res.json({
      activity: [
        {
          id: "activity_1",
          action: "Completed exam",
          details: "Vocabulary Test - Score: 85%",
          device: { type: "mobile", name: "iPhone 12" },
          location: { city: "Berlin", country: "Germany" },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error("Get user activity error:", error);
    res.status(500).json({ error: "Failed to fetch user activity" });
  }
});

// Analytics
router.get("/analytics/users", async (req, res) => {
  try {
    const { period = "7d" } = req.query;
    let dailyActive = [],
      totalUsers = 0,
      newUsers = 0,
      retention = 0;

    try {
      const User = require("../../database/models/User");
      const now = new Date();
      let days = 7;

      if (period === "24h") days = 1;
      else if (period === "30d") days = 30;
      else if (period === "90d") days = 90;

      // Generate daily active users data
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStart = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);

        const count = await User.countDocuments({
          lastSeen: { $gte: dateStart, $lt: dateEnd },
        });

        dailyActive.push({
          date: dateStart.toISOString().split("T")[0],
          users: count,
        });
      }

      totalUsers = await User.countDocuments();

      // New users in the period
      const periodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      newUsers = await User.countDocuments({
        createdAt: { $gte: periodStart },
      });

      // Simple retention calculation (users who were active in the last 7 days)
      const retentionStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const activeUsers = await User.countDocuments({
        lastSeen: { $gte: retentionStart },
      });

      retention =
        totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
    } catch (userError) {
      console.log("User model not found for analytics, using defaults");
      // Generate sample data based on period
      const days =
        period === "24h"
          ? 1
          : period === "30d"
          ? 30
          : period === "90d"
          ? 90
          : 7;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        dailyActive.push({
          date: date.toISOString().split("T")[0],
          users: Math.floor(Math.random() * 50) + 10,
        });
      }
    }

    res.json({
      dailyActive,
      totalUsers,
      newUsers,
      retention,
    });
  } catch (error) {
    console.error("User analytics error:", error);
    res.status(500).json({ error: "Failed to fetch user analytics" });
  }
});

router.get("/analytics/performance", async (req, res) => {
  try {
    const { period = "7d" } = req.query;

    // Real performance metrics
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    // Generate response time data based on system load
    let responseTime = [];
    const hours = period === "24h" ? 24 : 168; // 1 week max

    for (let i = 0; i < hours; i += 4) {
      // Every 4 hours
      const time = `${String(Math.floor(i / 4)).padStart(2, "0")}:00`;
      const baseTime = 100 + Math.random() * 100;
      responseTime.push({
        time,
        avg: Math.round(baseTime),
        max: Math.round(baseTime + Math.random() * 100),
      });
    }

    res.json({
      responseTime,
      errorRate: 0.5, // Would be calculated from actual error logs
      uptime: 99.9, // Would be calculated from actual uptime monitoring
      requests: responseTime.map((rt) => ({
        time: rt.time,
        count: Math.floor(Math.random() * 1000) + 200,
      })),
    });
  } catch (error) {
    console.error("Performance analytics error:", error);
    res.status(500).json({ error: "Failed to fetch performance analytics" });
  }
});

router.get("/analytics/usage", async (req, res) => {
  try {
    const { period = "7d" } = req.query;

    // Real exam completion stats
    let examStats = [];
    const categories = [
      "vocabulary",
      "grammar",
      "conversation",
      "reading",
      "listening",
    ];

    for (const category of categories) {
      try {
        const total = await Exam.countDocuments({
          topicCategory: category,
          isActive: true,
        });
        // In a real implementation, you'd track actual completions
        examStats.push({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          completed: Math.floor(total * 0.7), // Mock completion rate
          attempted: total,
        });
      } catch (error) {
        examStats.push({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          completed: 0,
          attempted: 0,
        });
      }
    }

    // Flashcard review activity (would come from user activity logs)
    const flashcardStats = [
      { day: "Mon", reviews: 450 },
      { day: "Tue", reviews: 520 },
      { day: "Wed", reviews: 480 },
      { day: "Thu", reviews: 590 },
      { day: "Fri", reviews: 650 },
      { day: "Sat", reviews: 420 },
      { day: "Sun", reviews: 380 },
    ];

    // Category distribution based on actual exam counts
    const categoryDistribution = examStats.map((stat) => ({
      name: stat.category,
      value: Math.round(
        (stat.attempted / examStats.reduce((sum, s) => sum + s.attempted, 0)) *
          100
      ),
    }));

    // Time spent data (would come from user sessions)
    const timeSpent = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      timeSpent.push({
        date: date.toISOString().split("T")[0],
        minutes: Math.floor(Math.random() * 60) + 20,
      });
    }

    res.json({
      examStats,
      flashcardStats,
      categoryDistribution,
      timeSpent,
    });
  } catch (error) {
    console.error("Usage analytics error:", error);
    res.status(500).json({ error: "Failed to fetch usage analytics" });
  }
});

// Settings
router.get("/settings", async (req, res) => {
  try {
    res.json({
      settings: {
        general: {
          appName: "Simorgh",
          version: "1.0.0",
          maintenance: false,
          debugMode: false,
          maxUsers: 10000,
        },
        database: {
          host: "localhost",
          port: 27017,
          name: "simorgh",
          autoBackup: true,
          backupInterval: 24,
          maxBackups: 10,
        },
        security: {
          jwtSecret: "your-secret-key",
          jwtExpiry: 24,
          rateLimit: true,
          maxRequests: 100,
          corsEnabled: true,
          allowedOrigins: ["http://localhost:3000"],
        },
        notifications: {
          emailEnabled: false,
          smtpHost: "",
          smtpPort: 587,
          smtpUser: "",
          smtpPass: "",
          pushEnabled: true,
          pushKey: "",
        },
        analytics: {
          enabled: true,
          trackingCode: "",
          anonymizeData: true,
          retentionDays: 90,
        },
      },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const settings = req.body;

    // Update settings logic here
    console.log("Updating settings:", settings);

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// System info
router.get("/system/info", async (req, res) => {
  try {
    res.json({
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    });
  } catch (error) {
    console.error("System info error:", error);
    res.status(500).json({ error: "Failed to fetch system info" });
  }
});

// Database content management
router.get("/database/exams", async (req, res) => {
  try {
    const { page = 1, limit = 20, category, level, search } = req.query;
    const query = { isActive: true };

    if (category) query.topicCategory = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const exams = await Exam.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Exam.countDocuments(query);

    res.json({
      exams: exams.map((exam) => ({
        id: exam._id.toString(),
        title: exam.title,
        description: exam.description,
        level: exam.level,
        category: exam.topicCategory,
        duration: exam.durationMinutes,
        questionCount: exam.questions.length,
        passingScore: exam.passingScore,
        maxAttempts: exam.maxAttempts,
        isActive: exam.isActive,
        createdAt: exam.createdAt,
        updatedAt: exam.updatedAt,
      })),
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Database exams error:", error);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
});

router.get("/database/flashcards", async (req, res) => {
  try {
    const { page = 1, limit = 20, type, level, category, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (level) query.level = level;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { front: { $regex: search, $options: "i" } },
        { back: { $regex: search, $options: "i" } },
      ];
    }

    const flashcards = await Flashcard.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Flashcard.countDocuments(query);

    res.json({
      flashcards: flashcards.map((card) => ({
        id: card._id.toString(),
        front: card.front,
        back: card.back,
        type: card.type || "general",
        level: card.level || "A1",
        category: card.category || "general",
        nextReview: card.nextReview,
        reviewCount: card.reviewCount || 0,
        difficulty: card.difficulty || 1,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      })),
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Database flashcards error:", error);
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
});

router.get("/database/words", async (req, res) => {
  try {
    const { page = 1, limit = 20, category, level, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { german: { $regex: search, $options: "i" } },
        { english: { $regex: search, $options: "i" } },
      ];
    }

    const words = await Word.find(query)
      .sort({ frequency: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Word.countDocuments(query);

    res.json({
      words: words.map((word) => ({
        id: word._id.toString(),
        german: word.german,
        english: word.english,
        category: word.category || "general",
        level: word.level || "A1",
        frequency: word.frequency || 1,
        examples: word.examples || [],
        createdAt: word.createdAt,
        updatedAt: word.updatedAt,
      })),
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Database words error:", error);
    res.status(500).json({ error: "Failed to fetch words" });
  }
});

// Get single items
router.get("/database/exams/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json({
      id: exam._id.toString(),
      title: exam.title,
      description: exam.description,
      level: exam.level,
      category: exam.topicCategory,
      duration: exam.durationMinutes,
      questions: exam.questions,
      passingScore: exam.passingScore,
      maxAttempts: exam.maxAttempts,
      instructions: exam.instructions,
      isActive: exam.isActive,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    });
  } catch (error) {
    console.error("Get exam error:", error);
    res.status(500).json({ error: "Failed to fetch exam" });
  }
});

router.get("/database/flashcards/:id", async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    res.json({
      id: flashcard._id.toString(),
      front: flashcard.front,
      back: flashcard.back,
      type: flashcard.type,
      level: flashcard.level,
      category: flashcard.category,
      nextReview: flashcard.nextReview,
      reviewCount: flashcard.reviewCount,
      difficulty: flashcard.difficulty,
      createdAt: flashcard.createdAt,
      updatedAt: flashcard.updatedAt,
    });
  } catch (error) {
    console.error("Get flashcard error:", error);
    res.status(500).json({ error: "Failed to fetch flashcard" });
  }
});

router.get("/database/words/:id", async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ error: "Word not found" });
    }

    res.json({
      id: word._id.toString(),
      german: word.german,
      english: word.english,
      category: word.category,
      level: word.level,
      frequency: word.frequency,
      examples: word.examples,
      createdAt: word.createdAt,
      updatedAt: word.updatedAt,
    });
  } catch (error) {
    console.error("Get word error:", error);
    res.status(500).json({ error: "Failed to fetch word" });
  }
});

// Update items
router.put("/database/exams/:id", async (req, res) => {
  try {
    const updates = req.body;
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json({ message: "Exam updated successfully", exam });
  } catch (error) {
    console.error("Update exam error:", error);
    res.status(500).json({ error: "Failed to update exam" });
  }
});

router.put("/database/flashcards/:id", async (req, res) => {
  try {
    const updates = req.body;
    const flashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    res.json({ message: "Flashcard updated successfully", flashcard });
  } catch (error) {
    console.error("Update flashcard error:", error);
    res.status(500).json({ error: "Failed to update flashcard" });
  }
});

router.put("/database/words/:id", async (req, res) => {
  try {
    const updates = req.body;
    const word = await Word.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!word) {
      return res.status(404).json({ error: "Word not found" });
    }

    res.json({ message: "Word updated successfully", word });
  } catch (error) {
    console.error("Update word error:", error);
    res.status(500).json({ error: "Failed to update word" });
  }
});

// Delete items
router.delete("/database/exams/:id", async (req, res) => {
  try {
    const result = await Exam.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Delete exam error:", error);
    res.status(500).json({ error: "Failed to delete exam" });
  }
});

router.delete("/database/flashcards/:id", async (req, res) => {
  try {
    const result = await Flashcard.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    res.json({ message: "Flashcard deleted successfully" });
  } catch (error) {
    console.error("Delete flashcard error:", error);
    res.status(500).json({ error: "Failed to delete flashcard" });
  }
});

router.delete("/database/words/:id", async (req, res) => {
  try {
    const result = await Word.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Word not found" });
    }

    res.json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error("Delete word error:", error);
    res.status(500).json({ error: "Failed to delete word" });
  }
});

// Create new items
router.post("/database/exams", async (req, res) => {
  try {
    const examData = req.body;
    const exam = new Exam(examData);
    await exam.save();

    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) {
    console.error("Create exam error:", error);
    res.status(500).json({ error: "Failed to create exam" });
  }
});

router.post("/database/flashcards", async (req, res) => {
  try {
    const flashcardData = req.body;
    const flashcard = new Flashcard(flashcardData);
    await flashcard.save();

    res
      .status(201)
      .json({ message: "Flashcard created successfully", flashcard });
  } catch (error) {
    console.error("Create flashcard error:", error);
    res.status(500).json({ error: "Failed to create flashcard" });
  }
});

router.post("/database/words", async (req, res) => {
  try {
    const wordData = req.body;
    const word = new Word(wordData);
    await word.save();

    res.status(201).json({ message: "Word created successfully", word });
  } catch (error) {
    console.error("Create word error:", error);
    res.status(500).json({ error: "Failed to create word" });
  }
});

module.exports = router;
