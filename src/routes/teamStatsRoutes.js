const express = require("express");
const router = express.Router();
const teamStatsService = require("../services/teamStatsService");
const errorLogService = require("../services/errorLogService");

// GET all team stats
router.get("/team-stats", async (req, res) => {
  try {
    const data = await teamStatsService.getAllTeamStats();
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'teamStatsRoutes.js', { route: '/team-stats', method: 'GET' });
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
    await errorLogService.logRouteError(error, 'teamStatsRoutes.js', { route: '/team-stats/:id', method: 'GET', id });
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
    await errorLogService.logRouteError(error, 'teamStatsRoutes.js', { route: '/teams/:teamId/team-stats', method: 'GET', teamId });
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
    await errorLogService.logRouteError(error, 'teamStatsRoutes.js', { route: '/seasons/:seasonId/team-stats', method: 'GET', seasonId });
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
    await errorLogService.logRouteError(error, 'teamStatsRoutes.js', { route: '/games/:gameId/team-stats', method: 'GET', gameId });
    res.status(400).json({ error: error.message });
  }
});

// GET team statistics sum by team ID
router.get("/teams/:teamId/stats/sum", async (req, res) => {
  try {
    const { teamId } = req.params;
    const data = await teamStatsService.getTeamStatsSumByTeamId(teamId);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'teamStatsRoutes.js', { route: '/teams/:teamId/stats/sum', method: 'GET', teamId });
    res.status(400).json({ error: error.message });
  }
});

// GET team statistics sum by multiple team IDs
router.get("/teams/stats/sum", async (req, res) => {
  try {
    const { teamIds } = req.query;

    if (!teamIds) {
      return res.status(400).json({ error: "teamIds query parameter is required" });
    }

    // Parse teamIds from query string (comma-separated)
    const teamIdsArray = teamIds.split(',').map(id => parseInt(id.trim()));

    const data = await teamStatsService.getTeamStatsSumByTeamIds(teamIdsArray);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'teamStatsRoutes.js', { route: '/teams/stats/sum', method: 'GET', teamIds });
    res.status(400).json({ error: error.message });
  }
});

// GET game statistics by team IDs and game ID
router.get("/games/:gameId/teams/stats", async (req, res) => {
  try {
    const { gameId } = req.params;
    const { teamIds } = req.query;

    if (!teamIds) {
      return res.status(400).json({ error: "teamIds query parameter is required" });
    }

    // Parse teamIds from query string (comma-separated)
    const teamIdsArray = teamIds.split(',').map(id => parseInt(id.trim()));

    const data = await teamStatsService.getGameStatsByTeamIdsAndGameId(teamIdsArray, gameId);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'teamStatsRoutes.js', { route: '/games/:gameId/teams/stats', method: 'GET', gameId, teamIds });
    res.status(400).json({ error: error.message });
  }
});

// GET team statistics against all opponents
router.get("/teams/:teamId/opponents/stats", async (req, res) => {
  try {
    const { teamId } = req.params;

    const data = await teamStatsService.getTeamStatsAgainstAllOpponents(teamId);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'teamStatsRoutes.js', { route: '/teams/:teamId/opponents/stats', method: 'GET', teamId });
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
