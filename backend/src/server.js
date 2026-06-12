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
// CORS_ORIGINS: comma-separated browser origins (admin panel etc.).
// Unset → allow all (dev mode). Native app requests have no Origin and are unaffected.
const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  })
);
app.use(express.json());

// Admin JWT middleware — protects /api/admin/* routes
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Blanket guard for /api/*: requires the app API key (mobile app) or a valid
// admin JWT (admin panel). /api/admin/* is excluded — it has its own JWT
// middleware, and /api/admin/login must stay reachable unauthenticated.
const APP_API_KEY = process.env.APP_API_KEY;
function requireAppKeyOrAdmin(req, res, next) {
  if (req.path.startsWith("/admin")) return next();
  if (!APP_API_KEY) return next(); // key not configured → open (dev mode)
  if (req.headers["x-api-key"] === APP_API_KEY) return next();
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    try {
      jwt.verify(auth.slice(7), JWT_SECRET || "dev-secret");
      return next();
    } catch {
      // fall through to 401
    }
  }
  return res.status(401).json({ error: "Unauthorized" });
}

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
app.use("/api", requireAppKeyOrAdmin);
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

// Live job search — proxies the official Arbeitsagentur API with caching
const jobsRoutes = require("./routes/jobs");
app.use("/api/jobs", jobsRoutes);

// Translation proxy — cached MyMemory translations for the app
const translateRoutes = require("./routes/translate");
app.use("/api/translate", translateRoutes);

// Analytics — app ingestion (API key) and admin summary (JWT)
const analyticsRoutes = require("./routes/analytics");
app.use("/api/analytics", analyticsRoutes.publicRouter);
app.use("/api/admin/analytics", requireAdminJWT, analyticsRoutes.adminRouter);

// Public endpoint — returns enabled countries list for the app
app.get("/api/countries", async (req, res) => {
  try {
    const all = await getCountries();
    res.json({ countries: all.filter(c => c.enabled) });
  } catch (error) {
    console.error("Countries error:", error);
    res.status(500).json({ error: "Failed to get countries" });
  }
});

// Lightweight public endpoint — app polls this for feature flag changes
app.get("/api/feature-flags", async (req, res) => {
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
app.get("/api/events", async (req, res) => {
  try {
    const { country, state, city, category } = req.query;
    const events = await getEvents({ country, state, city, category, enabledOnly: true });
    res.json({ events });
  } catch (error) {
    console.error("Events error:", error);
    res.status(500).json({ error: "Failed to get events" });
  }
});

// Privacy policy — public URL required for app store listings
app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/privacy.html"));
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
