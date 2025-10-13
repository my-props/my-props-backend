const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

async function getAllTeamStats() {
  const query = `SELECT * FROM TeamStats`;

  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all team stats:', error);
    await errorLogService.logDatabaseError(error, 'teamStatsRepository.js', null, { function: 'getAllTeamStats' });
    throw error;
  }
}

async function getTeamStatsById(id) {
  const query = `SELECT * FROM TeamStats WHERE id = @id`;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting team stats by id:', error);
    await errorLogService.logDatabaseError(error, 'teamStatsRepository.js', null, { function: 'getTeamStatsById', id });
    throw error;
  }
}

async function getTeamStatsByTeamId(teamId) {
  const query = `SELECT * FROM TeamStats WHERE teamId = @teamId`;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('teamId', teamId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team stats by team id:', error);
    await errorLogService.logDatabaseError(error, 'teamStatsRepository.js', null, { function: 'getTeamStatsByTeamId', teamId });
    throw error;
  }
}

async function getTeamStatsBySeason(seasonId) {
  const query = `SELECT * FROM TeamStats WHERE SeasonYear = @seasonId`;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('seasonId', seasonId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team stats by season:', error);
    await errorLogService.logDatabaseError(error, 'teamStatsRepository.js', null, { function: 'getTeamStatsBySeason', seasonId });
    throw error;
  }
}

async function getTeamStatsByGameId(gameId) {
  const query = `SELECT * FROM TeamStats WHERE gameId = @gameId`;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('gameId', gameId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team stats by game id:', error);
    await errorLogService.logDatabaseError(error, 'teamStatsRepository.js', null, { function: 'getTeamStatsByGameId', gameId });
    throw error;
  }
}

async function getTeamStatsSumByTeamId(teamId) {
  const query = `
    SELECT 
      TeamId,
      SUM(TotalPoints) as TotalPointsSum,
      COUNT(*) as GameCount,
      AVG(CAST(TotalPoints as FLOAT)) as AveragePoints,
      MAX(TotalPoints) as MaxPoints,
      MIN(TotalPoints) as MinPoints
    FROM TeamStats 
    WHERE TeamId = @teamId AND Active = 1
    GROUP BY TeamId
  `;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('teamId', teamId)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting team stats sum by team id:', error);
    await errorLogService.logDatabaseError(error, 'teamStatsRepository.js', null, { function: 'getTeamStatsSumByTeamId', teamId });
    throw error;
  }
}

async function getTeamStatsSumByTeamIds(teamIds) {
  const query = `
    WITH TeamStatsWithMedians AS (
      SELECT 
        TeamId,
        TotalPoints,
        FastBreakPoints,
        PointsInPaint,
        SecondChancePoints,
        PointsOffTurnovers,
        FieldGoalsMade,
        FieldGoalsAttempted,
        FreeThrowsMade,
        FreeThrowsAttempted,
        ThreePointShotsMade,
        ThreePointShotsAttempted,
        OffensiveRebounds,
        DefensiveRebounds,
        TotalRebounds,
        Assists,
        PersonalFouls,
        Steals,
        Turnovers,
        Blocks,
        -- Calculate medians using PERCENTILE_CONT
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY TotalPoints) OVER (PARTITION BY TeamId) as MedianTotalPoints,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY FastBreakPoints) OVER (PARTITION BY TeamId) as MedianFastBreakPoints,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY PointsInPaint) OVER (PARTITION BY TeamId) as MedianPointsInPaint,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY SecondChancePoints) OVER (PARTITION BY TeamId) as MedianSecondChancePoints,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY PointsOffTurnovers) OVER (PARTITION BY TeamId) as MedianPointsOffTurnovers,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY FieldGoalsMade) OVER (PARTITION BY TeamId) as MedianFieldGoalsMade,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY FieldGoalsAttempted) OVER (PARTITION BY TeamId) as MedianFieldGoalsAttempted,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY FreeThrowsMade) OVER (PARTITION BY TeamId) as MedianFreeThrowsMade,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY FreeThrowsAttempted) OVER (PARTITION BY TeamId) as MedianFreeThrowsAttempted,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ThreePointShotsMade) OVER (PARTITION BY TeamId) as MedianThreePointShotsMade,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ThreePointShotsAttempted) OVER (PARTITION BY TeamId) as MedianThreePointShotsAttempted,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY OffensiveRebounds) OVER (PARTITION BY TeamId) as MedianOffensiveRebounds,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY DefensiveRebounds) OVER (PARTITION BY TeamId) as MedianDefensiveRebounds,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY TotalRebounds) OVER (PARTITION BY TeamId) as MedianTotalRebounds,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY Assists) OVER (PARTITION BY TeamId) as MedianAssists,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY PersonalFouls) OVER (PARTITION BY TeamId) as MedianPersonalFouls,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY Steals) OVER (PARTITION BY TeamId) as MedianSteals,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY Turnovers) OVER (PARTITION BY TeamId) as MedianTurnovers,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY Blocks) OVER (PARTITION BY TeamId) as MedianBlocks
      FROM TeamStats 
      WHERE TeamId IN (${teamIds.map((_, index) => `@teamId${index}`).join(', ')}) AND Active = 1
    )
    SELECT 
      TeamId,
      SUM(TotalPoints) as TotalPointsSum,
      COUNT(*) as GameCount,
      AVG(CAST(TotalPoints as FLOAT)) as AveragePoints,
      MAX(TotalPoints) as MaxPoints,
      MIN(TotalPoints) as MinPoints,
      -- Get median values (they'll be the same for all rows in each team group)
      MAX(MedianTotalPoints) as MedianTotalPoints,
      MAX(MedianFastBreakPoints) as MedianFastBreakPoints,
      MAX(MedianPointsInPaint) as MedianPointsInPaint,
      MAX(MedianSecondChancePoints) as MedianSecondChancePoints,
      MAX(MedianPointsOffTurnovers) as MedianPointsOffTurnovers,
      MAX(MedianFieldGoalsMade) as MedianFieldGoalsMade,
      MAX(MedianFieldGoalsAttempted) as MedianFieldGoalsAttempted,
      MAX(MedianFreeThrowsMade) as MedianFreeThrowsMade,
      MAX(MedianFreeThrowsAttempted) as MedianFreeThrowsAttempted,
      MAX(MedianThreePointShotsMade) as MedianThreePointShotsMade,
      MAX(MedianThreePointShotsAttempted) as MedianThreePointShotsAttempted,
      MAX(MedianOffensiveRebounds) as MedianOffensiveRebounds,
      MAX(MedianDefensiveRebounds) as MedianDefensiveRebounds,
      MAX(MedianTotalRebounds) as MedianTotalRebounds,
      MAX(MedianAssists) as MedianAssists,
      MAX(MedianPersonalFouls) as MedianPersonalFouls,
      MAX(MedianSteals) as MedianSteals,
      MAX(MedianTurnovers) as MedianTurnovers,
      MAX(MedianBlocks) as MedianBlocks
    FROM TeamStatsWithMedians
    GROUP BY TeamId
    ORDER BY TeamId
  `;

  try {
    const pool = await getPool();
    const request = pool.request();

    // Add each teamId as a parameter
    teamIds.forEach((teamId, index) => {
      request.input(`teamId${index}`, teamId);
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team stats sum by team ids:', error);
    await errorLogService.logDatabaseError(error, 'teamStatsRepository.js', null, { function: 'getTeamStatsSumByTeamIds', teamIds });
    throw error;
  }
}

async function getGameStatsByTeamIdsAndGameId(teamIds, gameId) {
  const query = `
    SELECT 
      GameId,
      TeamId,
      SUM(TotalPoints) as TotalPoints,
      SUM(FastBreakPoints) as FastBreakPoints,
      SUM(PointsInPaint) as PointsInPaint,
      SUM(SecondChancePoints) as SecondChancePoints,
      SUM(PointsOffTurnovers) as PointsOffTurnovers,
      SUM(FieldGoalsMade) as FieldGoalsMade,
      SUM(FieldGoalsAttempted) as FieldGoalsAttempted,
      SUM(FreeThrowsMade) as FreeThrowsMade,
      SUM(FreeThrowsAttempted) as FreeThrowsAttempted,
      SUM(ThreePointShotsMade) as ThreePointShotsMade,
      SUM(ThreePointShotsAttempted) as ThreePointShotsAttempted,
      SUM(OffensiveRebounds) as OffensiveRebounds,
      SUM(DefensiveRebounds) as DefensiveRebounds,
      SUM(TotalRebounds) as TotalRebounds,
      SUM(Assists) as Assists,
      SUM(PersonalFouls) as PersonalFouls,
      SUM(Steals) as Steals,
      SUM(Turnovers) as Turnovers,
      SUM(Blocks) as Blocks,
      MAX(BiggestLead) as BiggestLead,
      MAX(LongestRun) as LongestRun
    FROM GameStats 
    WHERE TeamId IN (${teamIds.map((_, index) => `@teamId${index}`).join(', ')}) 
      AND GameId = @gameId 
      AND Active = 1
    GROUP BY GameId, TeamId
    ORDER BY TeamId
  `;

  try {
    const pool = await getPool();
    const request = pool.request();

    // Add each teamId as a parameter
    teamIds.forEach((teamId, index) => {
      request.input(`teamId${index}`, teamId);
    });

    // Add gameId parameter
    request.input('gameId', gameId);

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting game stats by team ids and game id:', error);
    await errorLogService.logDatabaseError(error, 'teamStatsRepository.js', null, { function: 'getGameStatsByTeamIdsAndGameId', teamIds, gameId });
    throw error;
  }
}

async function getTeamStatsAgainstAllOpponents(teamId) {
  const query = `
    SELECT 
      gs.TeamId,
      gs.GameId,
      g.TeamHomeId,
      g.TeamVisitorId,
      CASE 
        WHEN g.TeamHomeId = @teamId THEN g.TeamVisitorId 
        ELSE g.TeamHomeId 
      END as OpponentTeamId,
      SUM(gs.TotalPoints) as TotalPoints,
      SUM(gs.FastBreakPoints) as FastBreakPoints,
      SUM(gs.PointsInPaint) as PointsInPaint,
      SUM(gs.SecondChancePoints) as SecondChancePoints,
      SUM(gs.PointsOffTurnovers) as PointsOffTurnovers,
      SUM(gs.FieldGoalsMade) as FieldGoalsMade,
      SUM(gs.FieldGoalsAttempted) as FieldGoalsAttempted,
      SUM(gs.FreeThrowsMade) as FreeThrowsMade,
      SUM(gs.FreeThrowsAttempted) as FreeThrowsAttempted,
      SUM(gs.ThreePointShotsMade) as ThreePointShotsMade,
      SUM(gs.ThreePointShotsAttempted) as ThreePointShotsAttempted,
      SUM(gs.OffensiveRebounds) as OffensiveRebounds,
      SUM(gs.DefensiveRebounds) as DefensiveRebounds,
      SUM(gs.TotalRebounds) as TotalRebounds,
      SUM(gs.Assists) as Assists,
      SUM(gs.PersonalFouls) as PersonalFouls,
      SUM(gs.Steals) as Steals,
      SUM(gs.Turnovers) as Turnovers,
      SUM(gs.Blocks) as Blocks,
      MAX(gs.BiggestLead) as BiggestLead,
      MAX(gs.LongestRun) as LongestRun,
      t.Name as OpponentTeamName,
      t.NickName as OpponentTeamNickName
    FROM GameStats gs
    INNER JOIN Game g ON gs.GameId = g.Id
    INNER JOIN Team t ON (
      CASE 
        WHEN g.TeamHomeId = @teamId THEN g.TeamVisitorId 
        ELSE g.TeamHomeId 
      END = t.Id
    )
    WHERE gs.TeamId = @teamId 
      AND gs.Active = 1 
      AND g.Active = 1
    GROUP BY gs.TeamId, gs.GameId, g.TeamHomeId, g.TeamVisitorId, t.Name, t.NickName
    ORDER BY gs.GameId
  `;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('teamId', teamId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team stats against all opponents:', error);
    await errorLogService.logDatabaseError(error, 'teamStatsRepository.js', null, { function: 'getTeamStatsAgainstAllOpponents', teamId });
    throw error;
  }
}


module.exports = {
  getAllTeamStats,
  getTeamStatsById,
  getTeamStatsByTeamId,
  getTeamStatsBySeason,
  getTeamStatsByGameId,
  getTeamStatsSumByTeamId,
  getTeamStatsSumByTeamIds,
  getGameStatsByTeamIdsAndGameId,
  getTeamStatsAgainstAllOpponents
};
