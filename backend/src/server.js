const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
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
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

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
app.use("/api", apiRoutes);
app.use("/api/database", databaseRoutes);
app.use("/api/database-version", databaseVersionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminSQLiteRoutes);

// Serve admin panel static files
app.use(express.static(path.join(__dirname, "../admin/build")));

// Admin panel route - serve React app
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/build/index.html"));
});

// Catch all handler for admin panel routes
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/build/index.html"));
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
