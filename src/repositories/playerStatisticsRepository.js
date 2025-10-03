const { getPool } = require("../config/database")
const errorLogService = require("../services/errorLogService")

async function getPlayerVsTeamStatistics(playerId, teamId) {
  const query = `
  
  `

  try {
    const pool = await getPool()
    const request = pool.request()
    request.input("playerId", playerId)
    request.input("teamId", teamId)

    const result = await request.query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting player vs team statistics:", error)
    await errorLogService.logDatabaseError(
      error,
      "playerStatisticsRepository.js",
      null,
      { function: "getPlayerVsTeamStatistics", playerId, teamId }
    )
    throw error
  }
}

async function getPlayerVsTeamStatisticsByPos(playerId, position, enemyTeamId) {
  const query = `
        SELECT 
            ps.PlayerId,
            p.FirstName,
            p.LastName,
            ps.Position,
            ps.TeamId,
            t.Name as TeamName,
            t.NickName as TeamNickName,
            COUNT(*) as GamesPlayed,
            AVG(CAST(ps.TotalPoints as FLOAT)) as AveragePoints,
            SUM(ps.TotalPoints) as TotalPoints,
            AVG(CAST(ps.FieldGoalsMade as FLOAT)) as AverageFieldGoalsMade,
            AVG(CAST(ps.FieldGoalsAttempted as FLOAT)) as AverageFieldGoalsAttempted,
            AVG(CAST(ps.FreeThrowsMade as FLOAT)) as AverageFreeThrowsMade,
            AVG(CAST(ps.FreeThrowsAttempted as FLOAT)) as AverageFreeThrowsAttempted,
            AVG(CAST(ps.ThreePointShotsMade as FLOAT)) as AverageThreePointShotsMade,
            AVG(CAST(ps.ThreePointShotsAttempted as FLOAT)) as AverageThreePointShotsAttempted,
            AVG(CAST(ps.TotalRebounds as FLOAT)) as AverageRebounds,
            AVG(CAST(ps.Assists as FLOAT)) as AverageAssists,
            AVG(CAST(ps.Steals as FLOAT)) as AverageSteals,
            AVG(CAST(ps.Blocks as FLOAT)) as AverageBlocks,
            AVG(CAST(ps.Turnovers as FLOAT)) as AverageTurnovers,
            AVG(CAST(ps.PersonalFouls as FLOAT)) as AveragePersonalFouls,
            MAX(ps.TotalPoints) as MaxPoints,
            MIN(ps.TotalPoints) as MinPoints,
            MAX(ps.TotalRebounds) as MaxRebounds,
            MAX(ps.Assists) as MaxAssists
        FROM PlayerStats ps
        INNER JOIN Player p ON ps.PlayerId = p.Id
        INNER JOIN Team t ON ps.TeamId = t.Id
        INNER JOIN Game g ON ps.GameId = g.Id
        WHERE ps.PlayerId = @playerId
            AND ps.Position = @position
            AND (
                (ps.TeamId = g.TeamHomeId AND g.TeamVisitorId = @enemyTeamId)
                OR (ps.TeamId = g.TeamVisitorId AND g.TeamHomeId = @enemyTeamId)
            )
            AND g.SeasonId = 10
            AND ps.Active = 1
            AND p.Active = 1
            AND t.Active = 1
            AND g.Active = 1
        GROUP BY ps.PlayerId, p.FirstName, p.LastName, ps.Position, ps.TeamId, t.Name, t.NickName
        ORDER BY AveragePoints DESC, GamesPlayed DESC
    `

  try {
    const pool = await getPool()
    const request = pool.request()
    request.input("playerId", playerId)
    request.input("position", position)
    request.input("enemyTeamId", enemyTeamId)

    const result = await request.query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting player vs team statistics by position:", error)
    await errorLogService.logDatabaseError(
      error,
      "playerStatisticsRepository.js",
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
