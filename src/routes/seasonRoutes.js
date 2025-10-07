const express = require("express")
const router = express.Router()
const seasonService = require("../services/seasonService")
const errorLogService = require("../services/errorLogService")

// GET all seasons
router.get("/", async (req, res) => {
  try {
    const data = await seasonService.getAllSeasons()
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "seasonRoutes.js", {
      route: "/seasons",
      method: "GET",
    })
    res.status(400).json({ error: error.message })
  }
})

// GET season by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const data = await seasonService.getSeasonById(id)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "seasonRoutes.js", {
      route: "/seasons/:id",
      method: "GET",
      id,
    })
    res.status(400).json({ error: error.message })
  }
})

// GET current season
router.get("/current", async (req, res) => {
  try {
    const data = await seasonService.getCurrentSeason()
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "seasonRoutes.js", {
      route: "/seasons/current",
      method: "GET",
    })
    res.status(400).json({ error: error.message })
  }
})

// GET seasons by year
router.get("/year/:year", async (req, res) => {
  try {
    const { year } = req.params
    const data = await seasonService.getSeasonsByYear(year)
    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "seasonRoutes.js", {
      route: "/seasons/year/:year",
      method: "GET",
      year,
    })
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
