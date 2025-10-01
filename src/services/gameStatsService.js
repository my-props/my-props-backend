const gameStatsRepository = require("../repositories/gameStatsRepository");

async function getAllGameStats() {
  try {
    const gameStats = await gameStatsRepository.getAllGameStats();
    return gameStats;
  } catch (error) {
    console.error('Error in gameStatsService.getAllGameStats:', error);
    throw error;
  }
}

async function getGameStatsById(id) {
  try {
    if (!id) {
      throw new Error("Game stats ID is required");
    }
    
    const gameStats = await gameStatsRepository.getGameStatsById(id);
    
    if (!gameStats) {
      throw new Error("Game stats not found");
    }
    
    return gameStats;
  } catch (error) {
    console.error('Error in gameStatsService.getGameStatsById:', error);
    throw error;
  }
}

async function getGameStatsByGameId(gameId) {
  try {
    if (!gameId) {
      throw new Error("Game ID is required");
    }
    
    const gameStats = await gameStatsRepository.getGameStatsByGameId(gameId);
    return gameStats;
  } catch (error) {
    console.error('Error in gameStatsService.getGameStatsByGameId:', error);
    throw error;
  }
}


module.exports = {
  getAllGameStats,
  getGameStatsById,
  getGameStatsByGameId
};
