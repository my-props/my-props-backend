const express = require("express")
const router = express.Router()
const playerStatsService = require("../services/playerStatsService")
const errorLogService = require("../services/errorLogService")

// GET all player stats
router.get("/player-stats", async (req, res) => {
  try {
    const data = await playerStatsService.getAllPlayerStats()
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "playerStatsRoutes.js", {
      route: "/player-stats",
      method: "GET",
    })
    res.status(400).json({ error: error.message })
  }
})

// GET player stats by ID
router.get("/player-stats/:id", async (req, res) => {
  try {
    const { id } = req.params
    const data = await playerStatsService.getPlayerStatsById(id)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "playerStatsRoutes.js", {
      route: "/player-stats/:id",
      method: "GET",
      id,
    })
    res.status(400).json({ error: error.message })
  }
})

// GET player stats by player ID
router.get("/players/:playerId/player-stats", async (req, res) => {
  try {
    const { playerId } = req.params
    const data = await playerStatsService.getPlayerStatsByPlayerId(playerId)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "playerStatsRoutes.js", {
      route: "/players/:playerId/player-stats",
      method: "GET",
      playerId,
    })
    res.status(400).json({ error: error.message })
  }
})

// GET player stats by game ID
router.get("/games/:gameId/player-stats", async (req, res) => {
  try {
    const { gameId } = req.params
    const data = await playerStatsService.getPlayerStatsByGameId(gameId)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "playerStatsRoutes.js", {
      route: "/games/:gameId/player-stats",
      method: "GET",
      gameId,
    })
    res.status(400).json({ error: error.message })
  }
})

// GET player stats by season ID
router.get("/seasons/:seasonId/player-stats", async (req, res) => {
  try {
    const { seasonId } = req.params
    const data = await playerStatsService.getPlayerStatsBySeason(seasonId)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "playerStatsRoutes.js", {
      route: "/seasons/:seasonId/player-stats",
      method: "GET",
      seasonId,
    })
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
