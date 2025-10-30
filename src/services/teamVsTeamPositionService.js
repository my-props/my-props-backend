const teamVsTeamPositionRepository = require("../repositories/teamVsTeamPositionRepository");
const errorLogService = require("./errorLogService");

/**
 * Get comparative statistics between two teams grouped by position
 * @param {number} teamId1 - First team ID
 * @param {number} teamId2 - Second team ID
 * @returns {Promise<Object>} Organized statistics by matchup type
 */
async function getTeamVsTeamPositionStats(teamId1, teamId2) {
  try {
    if (!teamId1 || !teamId2) {
      throw new Error("Both team IDs are required");
    }

    const teamId1Num = parseInt(teamId1, 10);
    const teamId2Num = parseInt(teamId2, 10);

    if (isNaN(teamId1Num) || isNaN(teamId2Num)) {
      throw new Error("Team IDs must be valid numbers");
    }

    const stats = await teamVsTeamPositionRepository.getTeamVsTeamPositionStats(teamId1Num, teamId2Num);

    // Organize data by matchup type for easier frontend consumption
    const organized = {
      team1: {
        id: teamId1Num,
        vsTeam2: [],
        vsAll: []
      },
      team2: {
        id: teamId2Num,
        vsTeam1: [],
        vsAll: []
      }
    };

    stats.forEach(stat => {
      const statData = {
        position: stat.Position,
        teamId: stat.TeamId,
        teamName: stat.TeamName,
        teamNickName: stat.TeamNickName,
        teamLogoUrl: stat.TeamLogoUrl,
        opponentTeamId: stat.OpponentTeamId,
        opponentTeamName: stat.OpponentTeamName,
        opponentTeamNickName: stat.OpponentTeamNickName,
        opponentTeamLogoUrl: stat.OpponentTeamLogoUrl,
        totalPointsScoredOver20Min: stat.TotalPointsScoredOver20Min,
        avgPointsConceded: stat.AvgPointsConceded,
        totalRebounds: stat.TotalRebounds,
        totalTurnovers: stat.TotalTurnovers,
        totalFouls: stat.TotalFouls,
        totalBlocks: stat.TotalBlocks,
        gamesPlayed: stat.GamesPlayed,
        avgPointsPerGame: stat.AvgPointsPerGame,
        avgReboundsPerGame: stat.AvgReboundsPerGame,
        avgTurnoversPerGame: stat.AvgTurnoversPerGame,
        avgFoulsPerGame: stat.AvgFoulsPerGame,
        avgBlocksPerGame: stat.AvgBlocksPerGame,
        lastUpdated: stat.LastUpdated
      };

      if (stat.MatchupType === 'Team1VsTeam2' && stat.TeamId === teamId1Num) {
        organized.team1.vsTeam2.push(statData);
      } else if (stat.MatchupType === 'Team2VsTeam1' && stat.TeamId === teamId2Num) {
        organized.team2.vsTeam1.push(statData);
      } else if (stat.MatchupType === 'Team1VsAll' && stat.TeamId === teamId1Num) {
        organized.team1.vsAll.push(statData);
      } else if (stat.MatchupType === 'Team2VsAll' && stat.TeamId === teamId2Num) {
        organized.team2.vsAll.push(statData);
      }
    });

    return organized;
  } catch (error) {
    console.error('Error in teamVsTeamPositionService.getTeamVsTeamPositionStats:', error);
    await errorLogService.logServiceError(error, 'teamVsTeamPositionService.js', null, { 
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
  try {
    if (!teamId) {
      throw new Error("Team ID is required");
    }

    const teamIdNum = parseInt(teamId, 10);

    if (isNaN(teamIdNum)) {
      throw new Error("Team ID must be a valid number");
    }

    const stats = await teamVsTeamPositionRepository.getTeamVsAllPositionStats(teamIdNum);

    return stats.map(stat => ({
      position: stat.Position,
      teamId: stat.TeamId,
      teamName: stat.TeamName,
      teamNickName: stat.TeamNickName,
      teamLogoUrl: stat.TeamLogoUrl,
      opponentTeamId: stat.OpponentTeamId,
      opponentTeamName: stat.OpponentTeamName,
      opponentTeamNickName: stat.OpponentTeamNickName,
      opponentTeamLogoUrl: stat.OpponentTeamLogoUrl,
      totalPointsScoredOver20Min: stat.TotalPointsScoredOver20Min,
      avgPointsConceded: stat.AvgPointsConceded,
      totalRebounds: stat.TotalRebounds,
      totalTurnovers: stat.TotalTurnovers,
      totalFouls: stat.TotalFouls,
      totalBlocks: stat.TotalBlocks,
      gamesPlayed: stat.GamesPlayed,
      avgPointsPerGame: stat.AvgPointsPerGame,
      avgReboundsPerGame: stat.AvgReboundsPerGame,
      avgTurnoversPerGame: stat.AvgTurnoversPerGame,
      avgFoulsPerGame: stat.AvgFoulsPerGame,
      avgBlocksPerGame: stat.AvgBlocksPerGame,
      lastUpdated: stat.LastUpdated
    }));
  } catch (error) {
    console.error('Error in teamVsTeamPositionService.getTeamVsAllPositionStats:', error);
    await errorLogService.logServiceError(error, 'teamVsTeamPositionService.js', null, { 
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

