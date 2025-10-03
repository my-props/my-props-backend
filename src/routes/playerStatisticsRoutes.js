const express = require("express");
const router = express.Router();
const playerStatisticsService = require("../services/playerStatisticsService");
const errorLogService = require("../services/errorLogService");

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
    await errorLogService.logRouteError(error, 'playerStatisticsRoutes.js', { route: '/player-match-statistics/:playerId/:teamId', method: 'GET', playerId, teamId });
    res.status(400).json({ error: error.message });
  }
});

router.get("/player-vs-player-statistics/:playerId1/:playerId2", async (req, res) => {
  try {
    const playerId1 = parseInt(req.params.playerId1);
    const playerId2 = parseInt(req.params.playerId2);

    if (!playerId1 || !playerId2) {
      return res.status(400).json({ error: "Invalid player IDs provided" });
    }

    let data = await playerStatisticsService.getPlayerVsPlayerStatistics(
      playerId1,
      playerId2
    );

    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'playerStatisticsRoutes.js', { route: '/player-vs-player-statistics/:playerId1/:playerId2', method: 'GET', playerId1, playerId2 });
    res.status(400).json({ error: error.message });
  }
});

router.get("/player-vs-all-teams-statistics/:playerId", async (req, res) => {
  try {
    const playerId = parseInt(req.params.playerId);
    const seasonId = req.query.seasonId ? parseInt(req.query.seasonId) : null;

    if (!playerId) {
      return res.status(400).json({ error: "Invalid player ID provided" });
    }

    let data = await playerStatisticsService.getPlayerVsAllTeamsStatistics(
      playerId,
      seasonId
    );

    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'playerStatisticsRoutes.js', { route: '/player-vs-all-teams-statistics/:playerId', method: 'GET', playerId: req.params.playerId, seasonId: req.query.seasonId });
    res.status(400).json({ error: error.message });
  }
});

router.get("/player-vs-team-detailed-statistics/:playerId/:enemyTeamId", async (req, res) => {
  try {
    const playerId = parseInt(req.params.playerId);
    const enemyTeamId = parseInt(req.params.enemyTeamId);
    const seasonId = req.query.seasonId ? parseInt(req.query.seasonId) : null;

    if (!playerId) {
      return res.status(400).json({ error: "Invalid player ID provided" });
    }
    if (!enemyTeamId) {
      return res.status(400).json({ error: "Invalid enemy team ID provided" });
    }

    let data = await playerStatisticsService.getPlayerVsTeamDetailedStatistics(
      playerId,
      enemyTeamId,
      seasonId
    );

    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'playerStatisticsRoutes.js', { route: '/player-vs-team-detailed-statistics/:playerId/:enemyTeamId', method: 'GET', playerId: req.params.playerId, enemyTeamId: req.params.enemyTeamId, seasonId: req.query.seasonId });
    res.status(400).json({ error: error.message });
  }
});

router.get("/player-vs-position-statistics/:playerId/:enemyPosition", async (req, res) => {
  try {
    const playerId = parseInt(req.params.playerId);
    const enemyPosition = req.params.enemyPosition;
    const seasonId = req.query.seasonId ? parseInt(req.query.seasonId) : null;

    if (!playerId) {
      return res.status(400).json({ error: "Invalid player ID provided" });
    }
    if (!enemyPosition) {
      return res.status(400).json({ error: "Invalid enemy position provided" });
    }

    let data = await playerStatisticsService.getPlayerVsPositionStatistics(
      playerId,
      enemyPosition,
      seasonId
    );

    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'playerStatisticsRoutes.js', { route: '/player-vs-position-statistics/:playerId/:enemyPosition', method: 'GET', playerId: req.params.playerId, enemyPosition: req.params.enemyPosition, seasonId: req.query.seasonId });
    res.status(400).json({ error: error.message });
  }
});

router.get("/player-in-position-vs-team-statistics/:playerId/:enemyTeamId/:position", async (req, res) => {
  try {
    const playerId = parseInt(req.params.playerId);
    const enemyTeamId = parseInt(req.params.enemyTeamId);
    const position = req.params.position;
    const seasonId = req.query.seasonId ? parseInt(req.query.seasonId) : null;

    if (!playerId) {
      return res.status(400).json({ error: "Invalid player ID provided" });
    }
    if (!enemyTeamId) {
      return res.status(400).json({ error: "Invalid enemy team ID provided" });
    }
    if (!position) {
      return res.status(400).json({ error: "Invalid position provided" });
    }

    let data = await playerStatisticsService.getPlayerInPositionVsTeamStatistics(
      playerId,
      enemyTeamId,
      position,
      seasonId
    );

    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'playerStatisticsRoutes.js', { route: '/player-in-position-vs-team-statistics/:playerId/:enemyTeamId/:position', method: 'GET', playerId: req.params.playerId, enemyTeamId: req.params.enemyTeamId, position: req.params.position, seasonId: req.query.seasonId });
    res.status(400).json({ error: error.message });
  }
});

router.get("/player-in-position-vs-all-teams-statistics/:playerId/:position", async (req, res) => {
  try {
    const playerId = parseInt(req.params.playerId);
    const position = req.params.position;
    const seasonId = req.query.seasonId ? parseInt(req.query.seasonId) : null;

    if (!playerId) {
      return res.status(400).json({ error: "Invalid player ID provided" });
    }
    if (!position) {
      return res.status(400).json({ error: "Invalid position provided" });
    }

    let data = await playerStatisticsService.getPlayerInPositionVsAllTeamsStatistics(
      playerId,
      position,
      seasonId
    );

    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'playerStatisticsRoutes.js', { route: '/player-in-position-vs-all-teams-statistics/:playerId/:position', method: 'GET', playerId: req.params.playerId, position: req.params.position, seasonId: req.query.seasonId });
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
