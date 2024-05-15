const express = require("express");
const router = express.Router();
const playerStatisticsService = require("../services/playerStatisticsService");

router.get("/player-match-statistics/:playerId/:teamId", async (req, res) => {
  try {
    const playerId = parseInt(req.params.playerId);
    const teamId = parseInt(req.params.teamId);

    if (!playerId || !teamId) {
      return res.status(400).json({ error: "Invalid team IDs provided" });
    }

    let data = await playerStatisticsService.getPlayerVsTeamStatistics(
      playerId,
      teamId
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
