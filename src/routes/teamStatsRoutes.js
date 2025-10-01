const express = require("express");
const router = express.Router();
const teamStatsService = require("../services/teamStatsService");

// GET all team stats
router.get("/team-stats", async (req, res) => {
  try {
    const data = await teamStatsService.getAllTeamStats();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET team stats by ID
router.get("/team-stats/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await teamStatsService.getTeamStatsById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET team stats by team ID
router.get("/teams/:teamId/team-stats", async (req, res) => {
  try {
    const { teamId } = req.params;
    const data = await teamStatsService.getTeamStatsByTeamId(teamId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET team stats by season ID
router.get("/seasons/:seasonId/team-stats", async (req, res) => {
  try {
    const { seasonId } = req.params;
    const data = await teamStatsService.getTeamStatsBySeason(seasonId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET team stats by game ID
router.get("/games/:gameId/team-stats", async (req, res) => {
  try {
    const { gameId } = req.params;
    const data = await teamStatsService.getTeamStatsByGameId(gameId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
