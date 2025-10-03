const gameScoreRepository = require("../repositories/gameScoreRepository");
const errorLogService = require("./errorLogService");

async function getAllGameScores() {
  try {
    const gameScores = await gameScoreRepository.getAllGameScores();
    return gameScores;
  } catch (error) {
    console.error('Error in gameScoreService.getAllGameScores:', error);
    await errorLogService.logServiceError(error, 'gameScoreService.js', null, { function: 'getAllGameScores' });
    throw error;
  }
}

async function getGameScoreById(id) {
  try {
    if (!id) {
      throw new Error("Game score ID is required");
    }
    
    const gameScore = await gameScoreRepository.getGameScoreById(id);
    
    if (!gameScore) {
      throw new Error("Game score not found");
    }
    
    return gameScore;
  } catch (error) {
    console.error('Error in gameScoreService.getGameScoreById:', error);
    await errorLogService.logServiceError(error, 'gameScoreService.js', null, { function: 'getGameScoreById', id });
    throw error;
  }
}

async function getGameScoresByGameId(gameId) {
  try {
    if (!gameId) {
      throw new Error("Game ID is required");
    }
    
    const gameScores = await gameScoreRepository.getGameScoresByGameId(gameId);
    return gameScores;
  } catch (error) {
    console.error('Error in gameScoreService.getGameScoresByGameId:', error);
    await errorLogService.logServiceError(error, 'gameScoreService.js', null, { function: 'getGameScoresByGameId', gameId });
    throw error;
  }
}


module.exports = {
  getAllGameScores,
  getGameScoreById,
  getGameScoresByGameId
};
