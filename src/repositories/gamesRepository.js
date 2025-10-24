const { getPool } = require("../config/database")
const errorLogService = require("../services/errorLogService")

async function getNextGames() {
  const query = `SELECT * FROM Game`

  try {
    const pool = await getPool()
    const result = await pool.request().query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting next games:", error)
    await errorLogService.logDatabaseError(error, "gamesRepository.js", null, {
      function: "getNextGames",
    })
    throw error
  }
}

async function getGamesFromLastDays(days) {
  const query = `SELECT *
      FROM Game
      WHERE StartDate >= DATEADD(DAY, -${days}, GETDATE())
        AND StartDate <= GETDATE();`

  try {
    const pool = await getPool()
    const result = await pool.request().query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting past games:", error)
    await errorLogService.logDatabaseError(error, "gamesRepository.js", null, {
      function: "getGamesFromLastDays",
    })
    throw error
  }
}

async function getTodaysGames(filters = {}) {
  let query = `
    SELECT 
      g.Id,
      g.SeasonId,
      g.LeagueId,
      g.TeamVisitorId,
      g.TeamHomeId,
      g.StartDate,
      g.EndDate,
      g.Duration,
      g.Clock,
      g.IsHalftime,
      g.Short,
      g.Status,
      g.CurrentPeriod,
      g.TotalPeriod,
      g.EndOfPeriod,
      g.InactiveDate,
      g.Active,
      g.CreatedAt,
      g.UpdatedAt,
      -- Home Team Info
      ht.Id as HomeTeamId,
      ht.Name as HomeTeamName,
      ht.NickName as HomeTeamNickName,
      ht.Code as HomeTeamCode,
      ht.City as HomeTeamCity,
      -- Visitor Team Info
      vt.Id as VisitorTeamId,
      vt.Name as VisitorTeamName,
      vt.NickName as VisitorTeamNickName,
      vt.Code as VisitorTeamCode,
      vt.City as VisitorTeamCity,
      -- League Info
      l.Name as LeagueName
    FROM Game g
    INNER JOIN Team ht ON g.TeamHomeId = ht.Id
    INNER JOIN Team vt ON g.TeamVisitorId = vt.Id
    INNER JOIN League l ON g.LeagueId = l.Id
    WHERE CAST(g.StartDate AS DATE) = CAST(GETDATE() AS DATE)
      AND g.Active = 1
      AND ht.Active = 1
      AND vt.Active = 1
      AND l.Active = 1`

  // Add filters if provided
  if (filters.leagueId) {
    query += ` AND g.LeagueId = ${filters.leagueId}`
  }
  
  if (filters.seasonId) {
    query += ` AND g.SeasonId = ${filters.seasonId}`
  }

  if (filters.status) {
    query += ` AND g.Status = '${filters.status}'`
  }

  // Order by start time
  query += ` ORDER BY g.StartDate ASC`

  // Limit to 8 games by default, but allow override
  const limit = filters.limit || 8
  query += ` OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY`

  try {
    const pool = await getPool()
    const result = await pool.request().query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting today's games:", error)
    await errorLogService.logDatabaseError(error, "gamesRepository.js", null, {
      function: "getTodaysGames",
    })
    throw error
  }
}

module.exports = { getNextGames, getGamesFromLastDays, getTodaysGames }
