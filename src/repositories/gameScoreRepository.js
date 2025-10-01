const { getPool } = require("../config/database");

async function getAllGameScores() {
    const query = `SELECT * FROM GameScore`;

    try {
        const pool = await getPool();
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting all game scores:', error);
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
        throw error;
    }
}


module.exports = {
    getAllGameScores,
    getGameScoreById,
    getGameScoresByGameId
};
