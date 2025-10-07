const express = require("express")
const router = express.Router()
const gameScoreService = require("../services/gameScoreService")
const errorLogService = require("../services/errorLogService")

// GET all game scores
router.get("/game-scores", async (req, res) => {
  try {
    const data = await gameScoreService.getAllGameScores()
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "gameScoreRoutes.js", {
      route: "/game-scores",
      method: "GET",
    })
    res.status(400).json({ error: error.message })
  }
})

// GET game score by ID
router.get("/game-scores/:id", async (req, res) => {
  try {
    const { id } = req.params
    const data = await gameScoreService.getGameScoreById(id)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "gameScoreRoutes.js", {
      route: "/game-scores/:id",
      method: "GET",
      id,
    })
    res.status(400).json({ error: error.message })
  }
})

// GET game scores by game ID
router.get("/games/:gameId/game-scores", async (req, res) => {
  try {
    const { gameId } = req.params
    const data = await gameScoreService.getGameScoresByGameId(gameId)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "gameScoreRoutes.js", {
      route: "/games/:gameId/game-scores",
      method: "GET",
      gameId,
    })
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
