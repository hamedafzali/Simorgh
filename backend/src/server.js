const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Initialize database connection
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  })
);
app.use(express.json());

// App API key middleware — protects /api/* public endpoints (not admin panel)
const APP_API_KEY = process.env.APP_API_KEY;
function requireAppApiKey(req, res, next) {
  if (!APP_API_KEY) return next(); // key not configured → open (dev mode)
  const key = req.headers["x-api-key"];
  if (key !== APP_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Admin JWT middleware — protects /api/admin/* routes
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function requireAdminJWT(req, res, next) {
  if (!ADMIN_PASSWORD) return next(); // not configured → open (dev mode)
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    jwt.verify(auth.slice(7), JWT_SECRET || "dev-secret");
    next();
  } catch {
    return res.status(401).json({ error: "Token expired or invalid" });
  }
}

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Simorgh Backend API is running!" });
});

// API routes
const apiRoutes = require("./routes/api");
const databaseRoutes = require("./routes/database");
const databaseVersionRoutes = require("./routes/databaseVersion");
const adminRoutes = require("./routes/admin");
const adminSQLiteRoutes = require("./routes/admin-sqlite");
const { getSettings } = require("./services/admin-settings-store");
const { getCountries } = require("./services/countries-store");
const { getEvents } = require("./services/events-store");
app.use("/api", apiRoutes);
app.use("/api/database", databaseRoutes);
app.use("/api/database-version", databaseVersionRoutes);

// Admin login — must be before the JWT middleware mounts
app.post("/api/admin/login", (req, res) => {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ error: "Admin auth not configured" });
  }
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET || "dev-secret", { expiresIn: "8h" });
  res.json({ token });
});

app.use("/api/admin", requireAdminJWT, adminRoutes);
app.use("/api/admin", requireAdminJWT, adminSQLiteRoutes);

// Public endpoint — returns enabled countries list for the app
app.get("/api/countries", requireAppApiKey, async (req, res) => {
  try {
    const all = await getCountries();
    res.json({ countries: all.filter(c => c.enabled) });
  } catch (error) {
    console.error("Countries error:", error);
    res.status(500).json({ error: "Failed to get countries" });
  }
});

// Lightweight public endpoint — app polls this for feature flag changes
app.get("/api/feature-flags", requireAppApiKey, async (req, res) => {
  try {
    const settings = await getSettings();
    res.json({
      featureFlags: settings.featureFlags || {},
      countryConfig: settings.countryConfig || {},
    });
  } catch (error) {
    console.error("Feature flags error:", error);
    res.status(500).json({ error: "Failed to get feature flags" });
  }
});

// Public endpoint — returns enabled events filtered by location
app.get("/api/events", requireAppApiKey, async (req, res) => {
  try {
    const { country, state, city, category } = req.query;
    const events = await getEvents({ country, state, city, category, enabledOnly: true });
    res.json({ events });
  } catch (error) {
    console.error("Events error:", error);
    res.status(500).json({ error: "Failed to get events" });
  }
});

// Serve admin panel static files
app.use(express.static(path.join(__dirname, "../../admin/build")));

// Admin panel route - serve React app
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../../admin/build/index.html"));
});

// Catch all handler for admin panel routes
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../admin/build/index.html"));
});

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`Access from your phone at: http://YOUR_LOCAL_IP:${PORT}`);

  // Connect to database
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/simorgh"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection error:", error);
  }
});
