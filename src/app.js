const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const playerRoutes = require("./routes/playerStatisticsRoutes");
const teamRoutes = require("./routes/teamStatisticsRoute");
const nextGames = require("./routes/gamesRoutes");
const userRoutes = require('./routes/userRoutes');
const healthCheckRoutes = require('./routes/healthCheck');

// New routes
const gameScoreRoutes = require('./routes/gameScoreRoutes');
const gameStatsRoutes = require('./routes/gameStatsRoutes');
const playerRoutesNew = require('./routes/playerRoutes');
const playerStatsRoutes = require('./routes/playerStatsRoutes');
const seasonRoutes = require('./routes/seasonRoutes');
const teamRoutesNew = require('./routes/teamRoutes');
const teamStatsRoutes = require('./routes/teamStatsRoutes');
const viewManagementRoutes = require('./routes/viewManagementRoutes');

require("dotenv").config();

const app = express();

// Basic middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use("/api", playerRoutes);
app.use("/api", teamRoutes);
app.use("/api", nextGames);
app.use('/api/users', userRoutes);
app.use('/api/health', healthCheckRoutes);

// New route endpoints
app.use('/api', gameScoreRoutes);
app.use('/api', gameStatsRoutes);
app.use('/api', playerRoutesNew);
app.use('/api', playerStatsRoutes);
app.use('/api', seasonRoutes);
app.use('/api', teamRoutesNew);
app.use('/api', teamStatsRoutes);
app.use('/api/views', viewManagementRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 My Props Backend Server Started!");
  console.log("=".repeat(50));
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API endpoints available at: http://localhost:${PORT}/api`);
  console.log("=".repeat(50));
});
