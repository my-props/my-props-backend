const express = require("express");
const router = express.Router();
const teamService = require("../services/teamService");
const errorLogService = require("../services/errorLogService");

// GET all teams
router.get("/teams", async (req, res) => {
  try {
    const data = await teamService.getAllTeams();
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'teamRoutes.js', { route: '/teams', method: 'GET' });
    res.status(400).json({ error: error.message });
  }
});

// GET team by ID
router.get("/teams/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await teamService.getTeamById(id);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'teamRoutes.js', { route: '/teams/:id', method: 'GET', id });
    res.status(400).json({ error: error.message });
  }
});

// GET teams by league ID
router.get("/leagues/:leagueId/teams", async (req, res) => {
  try {
    const { leagueId } = req.params;
    const data = await teamService.getTeamsByLeagueId(leagueId);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'teamRoutes.js', { route: '/leagues/:leagueId/teams', method: 'GET', leagueId });
    res.status(400).json({ error: error.message });
  }
});

// GET teams by city
router.get("/teams/city/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const data = await teamService.getTeamsByCity(city);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'teamRoutes.js', { route: '/teams/city/:city', method: 'GET', city });
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
