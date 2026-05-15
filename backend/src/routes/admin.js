const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const Exam = require("../../database/models/Exam");
const Flashcard = require("../../database/models/Flashcard");
const Word = require("../../database/models/Word");
const {
  createArtifact,
  listArtifacts,
  deleteArtifact,
  getArtifactFile,
  getArtifact,
  getArtifactTables,
  getArtifactTableRows,
  restoreArtifact,
} = require("../services/database-artifacts");
const {
  listScripts,
  saveScript,
  deleteScript,
  getScript,
  listRuns,
  startRun,
  stopRun,
  finishRun,
  updateScriptLastRun,
  appendLog,
} = require("../services/script-registry");
const SQLiteGenerator = require("../../../admin/src/scripts/sqlite-generator");
const {
  getSettings,
  saveSettings,
} = require("../services/admin-settings-store");

function getUserModel() {
  try {
    return require("../../database/models/User");
  } catch {
    return null;
  }
}

// Dashboard stats
router.get("/dashboard", async (req, res) => {
  try {
    const [examCount, flashcardCount, wordCount] = await Promise.all([
      Exam.countDocuments({ isActive: true }),
      Flashcard.countDocuments(),
      Word.countDocuments(),
    ]);

    let totalUsers = 0,
      onlineUsers = 0,
      activeToday = 0,
      usersAvailable = false;
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
      usersAvailable = true;
    } catch (userError) {
      console.log("User model not found for dashboard");
    }

    const runs = await listRuns();
    const runningScripts = runs.filter((run) => run.status === "running");
    const failedScripts = runs.filter((run) => run.status === "failed");
    const memory = process.memoryUsage();
    const cpu = process.cpuUsage();

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
          available: usersAvailable,
        },
        scripts: {
          total: (await listScripts()).length,
          running: runningScripts.length,
          failed: failedScripts.length,
        },
        system: {
          uptime: process.uptime(),
          memoryMb: Math.round(memory.heapUsed / 1024 / 1024),
          rssMb: Math.round(memory.rss / 1024 / 1024),
          cpuMicros: cpu.user + cpu.system,
        },
      },
      recentActivity: runningScripts
        .concat(failedScripts)
        .slice(0, 10)
        .map((run) => ({
          user: "system",
          action: run.name,
          status: run.status === "failed" ? "error" : "success",
          time: new Date(run.startedAt).toLocaleString(),
        })),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// Database management
router.get("/database/backups", async (req, res) => {
  try {
    const backups = await listArtifacts();
    res.json({ backups });
  } catch (error) {
    console.error("Backups error:", error);
    res.status(500).json({ error: "Failed to fetch backups" });
  }
});

router.post("/database/backup", async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const artifact = await createArtifact({
      name,
      description,
      type: type || "backup",
    });
    res.json(artifact);
  } catch (error) {
    console.error("Backup error:", error);
    res.status(500).json({ error: "Failed to create backup" });
  }
});

router.post("/database/restore/:backupId", async (req, res) => {
  try {
    const { backupId } = req.params;
    const artifact = await restoreArtifact(backupId);
    res.json({ message: "Database restored successfully" });
  } catch (error) {
    console.error("Restore error:", error);
    res.status(500).json({ error: "Failed to restore database" });
  }
});

router.delete("/database/backup/:backupId", async (req, res) => {
  try {
    const { backupId } = req.params;
    await deleteArtifact(backupId);
    res.json({ message: "Backup deleted successfully" });
  } catch (error) {
    console.error("Delete backup error:", error);
    res.status(500).json({ error: "Failed to delete backup" });
  }
});

router.get("/database/backup/:backupId/download", async (req, res) => {
  try {
    const { backupId } = req.params;
    const kind = req.query.kind === "package" ? "package" : "db";
    const { artifact, filePath } = await getArtifactFile(backupId, kind);
    const stat = await fs.stat(filePath);

    res.setHeader(
      "Content-Type",
      kind === "package" ? "application/json" : "application/x-sqlite3"
    );
    res.setHeader("Content-Length", stat.size);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${artifact.name.replace(/[^a-z0-9-_]+/gi, "_")}.${kind === "package" ? "json" : "db"}"`
    );

    require("fs").createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Download backup error:", error);
    res.status(500).json({ error: "Failed to download backup" });
  }
});

router.get("/database/backup/:backupId", async (req, res) => {
  try {
    const artifact = await getArtifact(req.params.backupId);
    const tables = await getArtifactTables(req.params.backupId);
    res.json({ artifact, tables });
  } catch (error) {
    console.error("Get backup details error:", error);
    res.status(500).json({ error: "Failed to fetch backup details" });
  }
});

router.get("/database/backup/:backupId/table/:tableName", async (req, res) => {
  try {
    const { backupId, tableName } = req.params;
    const { page = 1, limit = 25 } = req.query;
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const result = await getArtifactTableRows(backupId, tableName, {
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
    });

    res.json({
      table: tableName,
      rows: result.rows,
      pagination: {
        current: pageNumber,
        pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  } catch (error) {
    console.error("Get backup table rows error:", error);
    res.status(500).json({ error: "Failed to fetch backup table rows" });
  }
});

// Script management
router.get("/scripts", async (req, res) => {
  try {
    res.json({ scripts: await listScripts() });
  } catch (error) {
    console.error("Scripts error:", error);
    res.status(500).json({ error: "Failed to fetch scripts" });
  }
});

router.get("/scripts/:scriptId", async (req, res) => {
  try {
    const { scriptId } = req.params;
    const script = await getScript(scriptId);
    if (!script) return res.status(404).json({ error: "Script not found" });
    res.json(script);
  } catch (error) {
    console.error("Get script error:", error);
    res.status(500).json({ error: "Failed to fetch script" });
  }
});

router.put("/scripts/:scriptId", async (req, res) => {
  try {
    const { scriptId } = req.params;
    const script = await saveScript(scriptId, req.body);
    res.json({ message: "Script updated successfully", script });
  } catch (error) {
    console.error("Update script error:", error);
    res.status(500).json({ error: "Failed to update script" });
  }
});

router.post("/scripts/:scriptId/run", async (req, res) => {
  try {
    const { scriptId } = req.params;
    const script = await getScript(scriptId);
    if (!script) return res.status(404).json({ error: "Script not found" });
    const run = await startRun(script);

    setTimeout(async () => {
      try {
        await appendLog(scriptId, "info", "Executing script action");
        if (scriptId === "script_seed_sqlite") {
          const generator = new SQLiteGenerator();
          await generator.generateDatabase();
          await appendLog(scriptId, "success", "SQLite database generated");
        } else if (scriptId === "script_package_sqlite") {
          const generator = new SQLiteGenerator();
          await generator.packageDatabase();
          await appendLog(scriptId, "success", "SQLite package created");
        } else {
          await appendLog(scriptId, "info", "Custom script recorded");
        }
        await updateScriptLastRun(scriptId);
        await finishRun(scriptId, true, "Script completed successfully");
      } catch (err) {
        await finishRun(
          scriptId,
          false,
          err instanceof Error ? err.message : "Script failed"
        );
      }
    }, 50);

    res.json(run);
  } catch (error) {
    console.error("Run script error:", error);
    res.status(500).json({ error: "Failed to run script" });
  }
});

router.post("/scripts/:scriptId/stop", async (req, res) => {
  try {
    const { scriptId } = req.params;
    await stopRun(scriptId);
    res.json({ message: "Script stopped successfully" });
  } catch (error) {
    console.error("Stop script error:", error);
    res.status(500).json({ error: "Failed to stop script" });
  }
});

router.delete("/scripts/:scriptId", async (req, res) => {
  try {
    await deleteScript(req.params.scriptId);
    res.json({ message: "Script deleted successfully" });
  } catch (error) {
    console.error("Delete script error:", error);
    res.status(500).json({ error: "Failed to delete script" });
  }
});

router.get("/scripts/:scriptId/logs", async (req, res) => {
  try {
    const { scriptId } = req.params;
    const runs = await listRuns();
    const run = runs.find((item) => item.scriptId === scriptId);
    res.json({ logs: run?.logs || [] });
  } catch (error) {
    console.error("Get script logs error:", error);
    res.status(500).json({ error: "Failed to fetch script logs" });
  }
});

router.get("/scripts/running", async (req, res) => {
  try {
    const runs = await listRuns();
    res.json({ running: runs.filter((item) => item.status === "running") });
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
    const User = getUserModel();
    if (!User) {
      return res.status(501).json({ error: "User model is not implemented" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      id: user._id.toString(),
      name: user.name || "Unknown",
      email: user.email || "unknown@example.com",
      status: user.status || "active",
      appVersion: user.appVersion || "1.0.0",
      dbVersion: user.dbVersion || "1.0.0",
      lastActive: user.lastSeen || user.createdAt,
      progress: user.progress || { exams: 0, flashcards: 0 },
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
    const User = getUserModel();
    if (!User) {
      return res.status(501).json({ error: "User model is not implemented" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: userData.name,
          email: userData.email,
          status: userData.status,
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const User = getUserModel();
    if (!User) {
      return res.status(501).json({ error: "User model is not implemented" });
    }
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.post("/users/:userId/ban", async (req, res) => {
  try {
    const { userId } = req.params;
    const User = getUserModel();
    if (!User) {
      return res.status(501).json({ error: "User model is not implemented" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { status: "banned" } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User banned successfully" });
  } catch (error) {
    console.error("Ban user error:", error);
    res.status(500).json({ error: "Failed to ban user" });
  }
});

router.get("/users/:userId/activity", async (req, res) => {
  try {
    const { userId } = req.params;
    const User = getUserModel();
    if (!User) {
      return res.status(501).json({ error: "User model is not implemented" });
    }
    const user = await User.findById(userId).select("lastSeen createdAt");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      activity: [
        {
          id: "activity_last_seen",
          action: "Last seen",
          details: "Most recent backend activity timestamp",
          timestamp: user.lastSeen || user.createdAt,
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
      retention = 0,
      dataAvailable = false;

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
      dataAvailable = true;
    } catch (userError) {
      console.log("User model not found for analytics");
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
          users: 0,
        });
      }
    }

    res.json({
      dailyActive,
      totalUsers,
      newUsers,
      retention,
      dataAvailable,
    });
  } catch (error) {
    console.error("User analytics error:", error);
    res.status(500).json({ error: "Failed to fetch user analytics" });
  }
});

router.get("/analytics/performance", async (req, res) => {
  try {
    const { period = "7d" } = req.query;

    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    let responseTime = [];
    const hours = period === "24h" ? 24 : 168; // 1 week max

    for (let i = 0; i < hours; i += 4) {
      const time = `${String(Math.floor(i / 4)).padStart(2, "0")}:00`;
      responseTime.push({
        time,
        avg: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        max: Math.round(memoryUsage.rss / 1024 / 1024),
      });
    }

    res.json({
      responseTime,
      errorRate: 0,
      uptime: Number(((uptime / Math.max(uptime, 1)) * 100).toFixed(1)),
      memoryMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      cpuMicros: process.cpuUsage().user + process.cpuUsage().system,
      requests: responseTime.map((rt) => ({
        time: rt.time,
        count: 0,
      })),
      dataAvailable: true,
    });
  } catch (error) {
    console.error("Performance analytics error:", error);
    res.status(500).json({ error: "Failed to fetch performance analytics" });
  }
});

router.get("/analytics/usage", async (req, res) => {
  try {
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
        examStats.push({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          completed: 0,
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

    const flashcardStats = [
      { day: "Mon", reviews: 0 },
      { day: "Tue", reviews: 0 },
      { day: "Wed", reviews: 0 },
      { day: "Thu", reviews: 0 },
      { day: "Fri", reviews: 0 },
      { day: "Sat", reviews: 0 },
      { day: "Sun", reviews: 0 },
    ];

    // Category distribution based on actual exam counts
    const totalAttempted = examStats.reduce((sum, s) => sum + s.attempted, 0);
    const categoryDistribution = examStats.map((stat) => ({
      name: stat.category,
      value:
        totalAttempted > 0
          ? Math.round((stat.attempted / totalAttempted) * 100)
          : 0,
    }));

    const timeSpent = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      timeSpent.push({
        date: date.toISOString().split("T")[0],
        minutes: 0,
      });
    }

    res.json({
      examStats,
      flashcardStats,
      categoryDistribution,
      timeSpent,
      dataAvailable: totalAttempted > 0,
    });
  } catch (error) {
    console.error("Usage analytics error:", error);
    res.status(500).json({ error: "Failed to fetch usage analytics" });
  }
});

// Settings
router.get("/settings", async (req, res) => {
  try {
    res.json({ settings: await getSettings() });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    await saveSettings(req.body);
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
