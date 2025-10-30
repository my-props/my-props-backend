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
      WHERE StartDate >= DATEADD(DAY, -${days}, DATEADD(HOUR, -3, GETDATE()))
        AND StartDate <= DATEADD(HOUR, -3, GETDATE());`

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
    ht.Id AS HomeTeamId,
    ht.Name AS HomeTeamName,
    ht.NickName AS HomeTeamNickName,
    ht.Code AS HomeTeamCode,
    ht.City AS HomeTeamCity,
    ht.TeamLogoUrl AS HomeTeamLogoUrl,
    ht.Conference AS HomeTeamConference,
    -- Visitor Team Info
    vt.Id AS VisitorTeamId,
    vt.Name AS VisitorTeamName,
    vt.NickName AS VisitorTeamNickName,
    vt.Code AS VisitorTeamCode,
    vt.City AS VisitorTeamCity,
    vt.TeamLogoUrl AS VisitorTeamLogoUrl,
    vt.Conference AS VisitorTeamConference,
    -- League Info
    l.Name AS LeagueName
FROM Game g
INNER JOIN Team ht ON g.TeamHomeId = ht.Id
INNER JOIN Team vt ON g.TeamVisitorId = vt.Id
INNER JOIN League l ON g.LeagueId = l.Id
WHERE 
    CAST(DATEADD(HOUR, -3, g.StartDate) AS DATE) = CAST(DATEADD(HOUR, -3, GETDATE()) AS DATE)
    AND g.Active = 1
    AND ht.Active = 1
    AND vt.Active = 1
    AND l.Active = 1
    AND g.Status != 'Finished'`

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
  const limit = filters.limit || 10
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

async function getNext8Games(filters = {}) {
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
      ht.TeamLogoUrl as HomeTeamLogoUrl,
      ht.Conference as HomeTeamConference,
      -- Visitor Team Info
      vt.Id as VisitorTeamId,
      vt.Name as VisitorTeamName,
      vt.NickName as VisitorTeamNickName,
      vt.Code as VisitorTeamCode,
      vt.City as VisitorTeamCity,
      vt.TeamLogoUrl as VisitorTeamLogoUrl,
      vt.Conference as VisitorTeamConference,
      -- League Info
      l.Name as LeagueName
    FROM Game g
    INNER JOIN Team ht ON g.TeamHomeId = ht.Id
    INNER JOIN Team vt ON g.TeamVisitorId = vt.Id
    INNER JOIN League l ON g.LeagueId = l.Id
    WHERE CAST(DATEADD(HOUR, -3, g.StartDate) AS DATE) >= CAST(DATEADD(HOUR, -3, GETDATE()) AS DATE) AND g.Status = 'Scheduled' 
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

  // Order by start time ascending (next games first)
  query += ` ORDER BY g.StartDate ASC`

  // Limit to 8 games
  query += ` OFFSET 0 ROWS FETCH NEXT 8 ROWS ONLY`

  try {
    const pool = await getPool()
    const result = await pool.request().query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting next 8 games:", error)
    await errorLogService.logDatabaseError(error, "gamesRepository.js", null, {
      function: "getNext8Games",
    })
    throw error
  }
}

async function getPrevious8Games(filters = {}) {
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
      ht.TeamLogoUrl as HomeTeamLogoUrl,
      ht.Conference as HomeTeamConference,
      -- Home Team Score
      gs_home.TotalPoints as HomeTeamTotalPoints,
      gs_home.PointsQ1 as HomeTeamPointsQ1,
      gs_home.PointsQ2 as HomeTeamPointsQ2,
      gs_home.PointsQ3 as HomeTeamPointsQ3,
      gs_home.PointsQ4 as HomeTeamPointsQ4,
      gs_home.Win as HomeTeamWin,
      gs_home.Loss as HomeTeamLoss,
      -- Visitor Team Info
      vt.Id as VisitorTeamId,
      vt.Name as VisitorTeamName,
      vt.NickName as VisitorTeamNickName,
      vt.Code as VisitorTeamCode,
      vt.City as VisitorTeamCity,
      vt.TeamLogoUrl as VisitorTeamLogoUrl,
      vt.Conference as VisitorTeamConference,
      -- Visitor Team Score
      gs_visitor.TotalPoints as VisitorTeamTotalPoints,
      gs_visitor.PointsQ1 as VisitorTeamPointsQ1,
      gs_visitor.PointsQ2 as VisitorTeamPointsQ2,
      gs_visitor.PointsQ3 as VisitorTeamPointsQ3,
      gs_visitor.PointsQ4 as VisitorTeamPointsQ4,
      gs_visitor.Win as VisitorTeamWin,
      gs_visitor.Loss as VisitorTeamLoss,
      -- League Info
      l.Name as LeagueName
    FROM Game g
    INNER JOIN Team ht ON g.TeamHomeId = ht.Id
    INNER JOIN Team vt ON g.TeamVisitorId = vt.Id
    INNER JOIN League l ON g.LeagueId = l.Id
    LEFT JOIN GameScore gs_home ON g.Id = gs_home.GameId AND gs_home.TeamId = g.TeamHomeId AND gs_home.Active = 1
    LEFT JOIN GameScore gs_visitor ON g.Id = gs_visitor.GameId AND gs_visitor.TeamId = g.TeamVisitorId AND gs_visitor.Active = 1
    WHERE CAST(DATEADD(HOUR, -3, g.StartDate) AS DATE) < CAST(DATEADD(HOUR, -3, GETDATE()) AS DATE)
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

  // Order by start time descending (most recent first)
  query += ` ORDER BY g.StartDate DESC`

  // Limit to 8 games
  query += ` OFFSET 0 ROWS FETCH NEXT 8 ROWS ONLY`

  try {
    const pool = await getPool()
    const result = await pool.request().query(query)
    return result.recordset
  } catch (error) {
    console.error("Error getting previous 8 games:", error)
    await errorLogService.logDatabaseError(error, "gamesRepository.js", null, {
      function: "getPrevious8Games",
    })
    throw error
  }
}

module.exports = {
  getNextGames,
  getGamesFromLastDays,
  getTodaysGames,
  getNext8Games,
  getPrevious8Games
}
