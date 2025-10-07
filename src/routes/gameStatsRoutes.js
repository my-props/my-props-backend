const express = require("express")
const router = express.Router()
const gameStatsService = require("../services/gameStatsService")
const errorLogService = require("../services/errorLogService")

// GET all game stats
router.get("/game-stats", async (req, res) => {
  try {
    const data = await gameStatsService.getAllGameStats()
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "gameStatsRoutes.js", {
      route: "/game-stats",
      method: "GET",
    })
    res.status(400).json({ error: error.message })
  }
})

// GET game stats by ID
router.get("/game-stats/:id", async (req, res) => {
  try {
    const { id } = req.params
    const data = await gameStatsService.getGameStatsById(id)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "gameStatsRoutes.js", {
      route: "/game-stats/:id",
      method: "GET",
      id,
    })
    res.status(400).json({ error: error.message })
  }
})

// GET game stats by game ID
router.get("/games/:gameId/game-stats", async (req, res) => {
  try {
    const { gameId } = req.params
    const data = await gameStatsService.getGameStatsByGameId(gameId)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "gameStatsRoutes.js", {
      route: "/games/:gameId/game-stats",
      method: "GET",
      gameId,
    })
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
