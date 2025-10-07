const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
require("dotenv").config()

// Import middleware
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler")

// Import routes
const playerStatisticsRoutes = require("./routes/playerStatisticsRoutes")
const teamStatisticsRoutes = require("./routes/teamStatisticsRoute")
const gamesRoutes = require("./routes/gamesRoutes")
const userRoutes = require("./routes/userRoutes")
const healthCheckRoutes = require("./routes/healthCheck")
const gameScoreRoutes = require("./routes/gameScoreRoutes")
const gameStatsRoutes = require("./routes/gameStatsRoutes")
const playerRoutes = require("./routes/playerRoutes")
const playerStatsRoutes = require("./routes/playerStatsRoutes")
const seasonRoutes = require("./routes/seasonRoutes")
const teamRoutes = require("./routes/teamRoutes")
const teamStatsRoutes = require("./routes/teamStatsRoutes")
const viewManagementRoutes = require("./routes/viewManagementRoutes")

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
// app.use(cors({
//     origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
//     credentials: true
// }));

// Compression middleware
app.use(compression())

// Request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "MyProps Backend is running",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
  })
})

// API Routes - Organized by domain
app.use("/api/players", playerRoutes)
app.use("/api/players", playerStatsRoutes)
app.use("/api/players", playerStatisticsRoutes)

app.use("/api/teams", teamRoutes)
app.use("/api/teams", teamStatsRoutes)
app.use("/api/teams", teamStatisticsRoutes)

app.use("/api/games", gamesRoutes)
app.use("/api/games", gameStatsRoutes)
app.use("/api/games", gameScoreRoutes)

app.use("/api/seasons", seasonRoutes)
app.use("/api/users", userRoutes)
app.use("/api/views", viewManagementRoutes)
app.use("/api/health", healthCheckRoutes)

// 404 handler for undefined routes
app.use(notFoundHandler)

// Global error handler
app.use(errorHandler)

module.exports = app
