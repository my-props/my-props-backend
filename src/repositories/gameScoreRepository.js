const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

async function getAllGameScores() {
    const query = `SELECT * FROM GameScore`;

    try {
        const pool = await getPool();
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting all game scores:', error);
        await errorLogService.logDatabaseError(error, 'gameScoreRepository.js', null, { function: 'getAllGameScores' });
        throw error;
    }
}

async function getGameScoreById(id) {
    const query = `SELECT * FROM GameScore WHERE id = @id`;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', id)
            .query(query);
        return result.recordset[0];
    } catch (error) {
        console.error('Error getting game score by id:', error);
        await errorLogService.logDatabaseError(error, 'gameScoreRepository.js', null, { function: 'getGameScoreById', id });
        throw error;
    }
}

async function getGameScoresByGameId(gameId) {
    const query = `SELECT * FROM GameScore WHERE gameId = @gameId`;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('gameId', gameId)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting game scores by game id:', error);
        await errorLogService.logDatabaseError(error, 'gameScoreRepository.js', null, { function: 'getGameScoresByGameId', gameId });
        throw error;
    }
}


module.exports = {
    getAllGameScores,
    getGameScoreById,
    getGameScoresByGameId
};
