const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

/**
 * Get comparative statistics between two teams grouped by position
 * @param {number} teamId1 - First team ID
 * @param {number} teamId2 - Second team ID
 * @returns {Promise<Array>} Array of statistics grouped by matchup type and position
 */
async function getTeamVsTeamPositionStats(teamId1, teamId2) {
  const query = `
    SELECT 
      TeamId1,
      TeamId2,
      MatchupType,
      TeamId,
      TeamName,
      TeamNickName,
      TeamLogoUrl,
      OpponentTeamId,
      OpponentTeamName,
      OpponentTeamNickName,
      OpponentTeamLogoUrl,
      Position,
      TotalPointsScoredOver20Min,
      AvgPointsConceded,
      TotalRebounds,
      TotalTurnovers,
      TotalFouls,
      TotalBlocks,
      GamesPlayed,
      AvgPointsPerGame,
      AvgReboundsPerGame,
      AvgTurnoversPerGame,
      AvgFoulsPerGame,
      AvgBlocksPerGame,
      LastUpdated
    FROM TeamVsTeamPositionStats
    WHERE (TeamId1 = @teamId1 AND TeamId2 = @teamId2)
       OR (TeamId1 = @teamId2 AND TeamId2 = @teamId1)
       OR (TeamId1 = @teamId1 AND TeamId2 IS NULL)
       OR (TeamId1 = @teamId2 AND TeamId2 IS NULL)
    ORDER BY MatchupType, Position
  `;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('teamId1', teamId1)
      .input('teamId2', teamId2)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team vs team position stats:', error);
    await errorLogService.logDatabaseError(error, 'teamVsTeamPositionRepository.js', null, { 
      function: 'getTeamVsTeamPositionStats', 
      teamId1, 
      teamId2 
    });
    throw error;
  }
}

/**
 * Get statistics for a single team against all opponents grouped by position
 * @param {number} teamId - Team ID
 * @returns {Promise<Array>} Array of statistics grouped by position
 */
async function getTeamVsAllPositionStats(teamId) {
  const query = `
    SELECT 
      TeamId1,
      TeamId2,
      MatchupType,
      TeamId,
      TeamName,
      TeamNickName,
      TeamLogoUrl,
      OpponentTeamId,
      OpponentTeamName,
      OpponentTeamNickName,
      OpponentTeamLogoUrl,
      Position,
      TotalPointsScoredOver20Min,
      AvgPointsConceded,
      TotalRebounds,
      TotalTurnovers,
      TotalFouls,
      TotalBlocks,
      GamesPlayed,
      AvgPointsPerGame,
      AvgReboundsPerGame,
      AvgTurnoversPerGame,
      AvgFoulsPerGame,
      AvgBlocksPerGame,
      LastUpdated
    FROM TeamVsTeamPositionStats
    WHERE TeamId1 = @teamId AND TeamId2 IS NULL
    ORDER BY MatchupType, Position
  `;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('teamId', teamId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team vs all position stats:', error);
    await errorLogService.logDatabaseError(error, 'teamVsTeamPositionRepository.js', null, { 
      function: 'getTeamVsAllPositionStats', 
      teamId 
    });
    throw error;
  }
}

module.exports = {
  getTeamVsTeamPositionStats,
  getTeamVsAllPositionStats
};

