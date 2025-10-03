const express = require("express")
const router = express.Router()
const playerStatisticsService = require("../services/playerStatisticsService")
const errorLogService = require("../services/errorLogService")

router.get("/player-match-statistics/:playerId/:teamId", async (req, res) => {
  try {
    const playerId = parseInt(req.params.playerId)
    const teamId = parseInt(req.params.teamId)

    if (!playerId || !teamId) {
      return res.status(400).json({ error: "Invalid team IDs provided" })
    }

    let data = await playerStatisticsService.getPlayerVsTeamStatistics(
      playerId,
      teamId
    )

    res.status(200).json(data)
  } catch (error) {
    await errorLogService.logRouteError(error, "playerStatisticsRoutes.js", {
      route: "/player-match-statistics/:playerId/:teamId",
      method: "GET",
      playerId: req.params.playerId,
      teamId: req.params.teamId,
    })
    res.status(400).json({ error: error.message })
  }
})

// GET player statistics by position against specific team
router.get(
  "/player-match-statistics/:playerId/:position/:enemyTeamId",
  async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId)
      const position = req.params.position
      const enemyTeamId = parseInt(req.params.enemyTeamId)

      // Validate parameters
      if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: "Invalid player ID provided" })
      }

      if (!position) {
        return res.status(400).json({ error: "Position is required" })
      }

      if (!enemyTeamId || isNaN(enemyTeamId)) {
        return res.status(400).json({ error: "Invalid enemy team ID provided" })
      }

      const data = await playerStatisticsService.getPlayerVsTeamStatisticsByPos(
        playerId,
        position,
        enemyTeamId
      )

      res.status(200).json(data)
    } catch (error) {
      await errorLogService.logRouteError(error, "playerStatisticsRoutes.js", {
        route: "/player-match-statistics/:playerId/:position/:enemyTeamId",
        method: "GET",
        playerId: req.params.playerId,
        position: req.params.position,
        enemyTeamId: req.params.enemyTeamId,
      })
      res.status(400).json({ error: error.message })
    }
  }
)

module.exports = router
