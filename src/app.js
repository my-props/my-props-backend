const express = require("express");
const cors = require("cors");
const playerRoutes = require("./routes/playerStatisticsRoutes");
const teamRoutes = require("./routes/teamStatisticsRoute");

const app = express();
app.use(express.json());
app.use(cors());

// Rotas
app.use("/api", playerRoutes);
app.use("/api", teamRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
