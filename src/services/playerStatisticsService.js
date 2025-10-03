const playerStatisticsRepository = require("../repositories/playerStatisticsRepository")
const errorLogService = require("./errorLogService")

async function getPlayerVsTeamStatistics(playerId, teamId) {
  try {
    if (!playerId) {
      throw new Error("Player ID is required")
    }
    if (!teamId) {
      throw new Error("Team ID is required")
    }

    let rows = await playerStatisticsRepository.getPlayerVsTeamStatistics(
      playerId,
      teamId
    )

    if (rows.length === 0) {
      throw new Error("No matchup data found for the provided IDs")
    }

    return rows
  } catch (error) {
    console.error(
      "Error in playerStatisticsService.getPlayerVsTeamStatistics:",
      error
    )
    await errorLogService.logServiceError(
      error,
      "playerStatisticsService.js",
      null,
      { function: "getPlayerVsTeamStatistics", playerId, teamId }
    )
    throw error
  }
}

async function getPlayerVsTeamStatisticsByPos(playerId, position, enemyTeamId) {
  try {
    if (!playerId) {
      throw new Error("Player ID is required")
    }
    if (!position) {
      throw new Error("Position is required")
    }
    if (!enemyTeamId) {
      throw new Error("Enemy Team ID is required")
    }

    // Validate position format (optional - can be removed if not needed)
    const validPositions = ["PG", "SG", "SF", "PF", "C"]
    if (!validPositions.includes(position.toUpperCase())) {
      console.warn(
        `Position "${position}" may not be a standard basketball position`
      )
    }

    const rows =
      await playerStatisticsRepository.getPlayerVsTeamStatisticsByPos(
        playerId,
        position,
        enemyTeamId
      )

    if (rows.length === 0) {
      throw new Error(
        `No statistics found for player ${playerId} in position ${position} against team ${enemyTeamId}`
      )
    }

    return rows
  } catch (error) {
    console.error(
      "Error in playerStatisticsService.getPlayerVsTeamStatisticsByPos:",
      error
    )
    await errorLogService.logServiceError(
      error,
      "playerStatisticsService.js",
      null,
      {
        function: "getPlayerVsTeamStatisticsByPos",
        playerId,
        position,
        enemyTeamId,
      }
    )
    throw error
  }
}

module.exports = {
  getPlayerVsTeamStatistics,
  getPlayerVsTeamStatisticsByPos,
}
