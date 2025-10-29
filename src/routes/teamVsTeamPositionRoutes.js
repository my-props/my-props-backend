const express = require("express");
const router = express.Router();
const teamVsTeamPositionService = require("../services/teamVsTeamPositionService");
const errorLogService = require("../services/errorLogService");

/**
 * GET /api/teams/:teamId1/vs/:teamId2/position-stats
 * Get comparative statistics between two teams grouped by player position
 */
router.get("/:teamId1/vs/:teamId2/position-stats", async (req, res) => {
  try {
    const { teamId1, teamId2 } = req.params;
    const data = await teamVsTeamPositionService.getTeamVsTeamPositionStats(teamId1, teamId2);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, "teamVsTeamPositionRoutes.js", {
      route: "/api/teams/:teamId1/vs/:teamId2/position-stats",
      method: "GET",
      teamId1: req.params.teamId1,
      teamId2: req.params.teamId2,
    });
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/teams/:teamId/vs-all/position-stats
 * Get statistics for a single team against all opponents grouped by position
 */
router.get("/:teamId/vs-all/position-stats", async (req, res) => {
  try {
    const { teamId } = req.params;
    const data = await teamVsTeamPositionService.getTeamVsAllPositionStats(teamId);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, "teamVsTeamPositionRoutes.js", {
      route: "/api/teams/:teamId/vs-all/position-stats",
      method: "GET",
      teamId: req.params.teamId,
    });
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

