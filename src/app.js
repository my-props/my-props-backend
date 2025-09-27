const express = require("express");
const cors = require("cors");
const playerRoutes = require("./routes/playerStatisticsRoutes");
const teamRoutes = require("./routes/teamStatisticsRoute");
const nextGames = require("./routes/gamesRoutes");
const userRoutes = require('./routes/userRoutes');
const healthCheckRoutes = require('./routes/healthCheck');

// Load environment variables
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Rotas
app.use("/api", playerRoutes);
app.use("/api", teamRoutes);
app.use("/api", nextGames);
app.use('/api/users', userRoutes);
app.use('/api/health', healthCheckRoutes);

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
