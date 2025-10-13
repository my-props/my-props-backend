const playerStatsRepository = require("../repositories/playerStatsRepository")
const errorLogService = require("./errorLogService")

async function getAllPlayerStats() {
  try {
    const playerStats = await playerStatsRepository.getAllPlayerStats()
    return playerStats
  } catch (error) {
    console.error("Error in playerStatsService.getAllPlayerStats:", error)
    await errorLogService.logServiceError(
      error,
      "playerStatsService.js",
      null,
      { function: "getAllPlayerStats" }
    )
    throw error
  }
}

async function getPlayerStatsById(id) {
  try {
    if (!id) {
      throw new Error("Player stats ID is required")
    }

    const playerStats = await playerStatsRepository.getPlayerStatsById(id)

    if (!playerStats) {
      throw new Error("Player stats not found")
    }

    return playerStats
  } catch (error) {
    console.error("Error in playerStatsService.getPlayerStatsById:", error)
    await errorLogService.logServiceError(
      error,
      "playerStatsService.js",
      null,
      { function: "getPlayerStatsById", id }
    )
    throw error
  }
}

async function getPlayerStatsByPlayerId(playerId) {
  try {
    if (!playerId) {
      throw new Error("Player ID is required")
    }

    const playerStats =
      await playerStatsRepository.getPlayerStatsByPlayerId(playerId)
    return playerStats
  } catch (error) {
    console.error(
      "Error in playerStatsService.getPlayerStatsByPlayerId:",
      error
    )
    await errorLogService.logServiceError(
      error,
      "playerStatsService.js",
      null,
      { function: "getPlayerStatsByPlayerId", playerId }
    )
    throw error
  }
}

async function getPlayerStatsByGameId(gameId) {
  try {
    if (!gameId) {
      throw new Error("Game ID is required")
    }

    const playerStats =
      await playerStatsRepository.getPlayerStatsByGameId(gameId)
    return playerStats
  } catch (error) {
    console.error("Error in playerStatsService.getPlayerStatsByGameId:", error)
    await errorLogService.logServiceError(
      error,
      "playerStatsService.js",
      null,
      { function: "getPlayerStatsByGameId", gameId }
    )
    throw error
  }
}

async function getPlayerStatsBySeason(seasonId) {
  try {
    if (!seasonId) {
      throw new Error("Season ID is required")
    }

    const playerStats =
      await playerStatsRepository.getPlayerStatsBySeason(seasonId)
    return playerStats
  } catch (error) {
    console.error("Error in playerStatsService.getPlayerStatsBySeason:", error)
    await errorLogService.logServiceError(
      error,
      "playerStatsService.js",
      null,
      { function: "getPlayerStatsBySeason", seasonId }
    )
    throw error
  }
}

module.exports = {
  getAllPlayerStats,
  getPlayerStatsById,
  getPlayerStatsByPlayerId,
  getPlayerStatsByGameId,
  getPlayerStatsBySeason,
  getPlayerStatsByGameId,
}
