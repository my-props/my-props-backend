const express = require("express")
const router = express.Router()
const gamesService = require("../services/gamesService")
const errorLogService = require("../services/errorLogService")

router.get("/", async (req, res) => {
  try {
    let data = await gamesService.getNextGames()

    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "gamesRoutes.js", {
      route: "/games",
      method: "GET",
    })
    res.status(400).json({ error: error.message })
  }
})

router.get("/fromlastdays/:days", async (req, res) => {
  try {
    const days = parseInt(req.params.days, 10)
    console.log("days", days)
    if (isNaN(days)) {
      return res.status(400).json({ error: "invalid parameter" })
    }

    let data = await gamesService.getGamesFromLastDays(days)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "gamesRoutes.js", {
      route: "/games/fromlastdays",
      method: "GET",
    })
    res.status(400).json({ error: error.message })
  }
})

router.get("/today", async (req, res) => {
  try {
    // Extract query parameters for filtering
    const filters = {}

    if (req.query.leagueId) {
      filters.leagueId = parseInt(req.query.leagueId, 10)
      if (isNaN(filters.leagueId)) {
        return res.status(400).json({ error: "Invalid leagueId parameter" })
      }
    }

    if (req.query.seasonId) {
      filters.seasonId = parseInt(req.query.seasonId, 10)
      if (isNaN(filters.seasonId)) {
        return res.status(400).json({ error: "Invalid seasonId parameter" })
      }
    }

    if (req.query.status) {
      filters.status = req.query.status
    }

    if (req.query.limit) {
      filters.limit = parseInt(req.query.limit, 10)
      if (isNaN(filters.limit) || filters.limit < 1) {
        return res.status(400).json({ error: "Invalid limit parameter" })
      }
    }

    let data = await gamesService.getTodaysGames(filters)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "gamesRoutes.js", {
      route: "/games/today",
      method: "GET",
    })
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
