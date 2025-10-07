const express = require("express");
const router = express.Router();
const playerService = require("../services/playerService");
const errorLogService = require("../services/errorLogService");

// GET all players
router.get("/", async (req, res) => {
  try {
    const data = await playerService.getAllPlayers();
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'playerRoutes.js', { route: '/players', method: 'GET' });
    res.status(400).json({ error: error.message });
  }
});

//TODO trocar por nome
// GET player by ID
router.get("/players/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await playerService.getPlayerById(id);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'playerRoutes.js', { route: '/players/:id', method: 'GET', id });
    res.status(400).json({ error: error.message });
  }
});

// GET players by team ID
router.get("/teams/:teamId/players", async (req, res) => {
  try {
    const { teamId } = req.params;
    const data = await playerService.getPlayersByTeamId(teamId);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'playerRoutes.js', { route: '/teams/:teamId/players', method: 'GET', teamId });
    res.status(400).json({ error: error.message });
  }
});

// GET players by position
router.get("/players/position/:position", async (req, res) => {
  try {
    const { position } = req.params;
    const data = await playerService.getPlayersByPosition(position);
    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'playerRoutes.js', { route: '/players/position/:position', method: 'GET', position });
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
