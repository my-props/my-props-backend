const express = require("express");
const router = express.Router();
const teamStatisticsService = require("../services/teamStatisticsService");

router.get("/matchup-statistics/:teamId1/:teamId2", async (req, res) => {
  try {
    const teamId1 = parseInt(req.params.teamId1);
    const teamId2 = parseInt(req.params.teamId2);

    if (!teamId1 || !teamId2) {
      return res.status(400).json({ error: "Invalid team IDs provided" });
    }

    let data = await teamStatisticsService.getTeamStatistics(teamId1, teamId2);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
