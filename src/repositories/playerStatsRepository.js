const { getPool } = require("../config/database")
const errorLogService = require("../services/errorLogService")

async function getAllPlayerStats() {
  const query = `SELECT * FROM PlayerStats`;

  try {
    const pool = await getPool()
    const result = await pool.request().query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting all player stats:", error)
    await errorLogService.logDatabaseError(
      error,
      "playerStatsRepository.js",
      null,
      { function: "getAllPlayerStats" }
    )
    throw error
  }
}

async function getPlayerStatsById(id) {
  const query = `SELECT * FROM PlayerStats WHERE id = @id`;

  try {
    const pool = await getPool()
    const result = await pool.request().input("id", id).query(query)
    return result.recordset[0]
  } catch (error) {
    console.error("Error getting player stats by id:", error)
    await errorLogService.logDatabaseError(
      error,
      "playerStatsRepository.js",
      null,
      { function: "getPlayerStatsById", id }
    )
    throw error
  }
}

async function getPlayerStatsByPlayerId(playerId) {
  const query = `SELECT * FROM PlayerStats WHERE playerId = @playerId`;

  try {
    const pool = await getPool()
    const result = await pool.request().input("playerId", playerId).query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting player stats by player id:", error)
    await errorLogService.logDatabaseError(
      error,
      "playerStatsRepository.js",
      null,
      { function: "getPlayerStatsByPlayerId", playerId }
    )
    throw error
  }
}

async function getPlayerStatsByGameId(gameId) {
  const query = `SELECT
concat(p.FirstName, ' ', p.LastName) as PlayerName,
t.Name as TeamName,
ps.* FROM PlayerStats ps
INNER JOIN Player p on ps.PlayerId = p.Id
INNER JOIN Team t on ps.TeamId = t.Id
WHERE gameId = @gameId`

  try {
    const pool = await getPool()
    const result = await pool.request().input("gameId", gameId).query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting player stats by game id:", error)
    await errorLogService.logDatabaseError(
      error,
      "playerStatsRepository.js",
      null,
      { function: "getPlayerStatsByGameId", gameId }
    )
    throw error
  }
}

async function getPlayerStatsBySeason(seasonId) {
  const query = `SELECT * FROM PlayerStats WHERE SeasonYear = @seasonId`;

  try {
    const pool = await getPool()
    const result = await pool.request().input("seasonId", seasonId).query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting player stats by season:", error)
    await errorLogService.logDatabaseError(
      error,
      "playerStatsRepository.js",
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
}
