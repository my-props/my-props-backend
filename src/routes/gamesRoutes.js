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

module.exports = router
