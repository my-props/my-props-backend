const { getPool } = require("../config/database")
const errorLogService = require("../services/errorLogService")

async function getPlayerVsTeamStatistics(playerId, teamId) {
    const query = `
        SELECT 
            PlayerId,
            PlayerFirstName,
            PlayerLastName,
            PlayerPosition,
            EnemyTeamId,
            EnemyTeamName,
            EnemyTeamNickName,
            SeasonId,
            SeasonYear,
            AveragePoints,
            AverageRebounds,
            AverageAssists,
            AverageSteals,
            AverageBlocks,
            AverageTurnovers,
            AverageFieldGoalsMade,
            AverageFieldGoalsAttempted,
            AverageThreePointShotsMade,
            AverageThreePointShotsAttempted,
            AverageFreeThrowsMade,
            AverageFreeThrowsAttempted,
            AveragePersonalFouls,
            AveragePlusMinus,
            MaxPoints,
            MinPoints,
            GamesPlayed,
            GamesOver20Points,
            GamesOver30Points,
            GamesOver40Points,
            LastUpdated
        FROM PlayerVsTeamStats
        WHERE PlayerId = @playerId 
          AND EnemyTeamId = @teamId
        ORDER BY SeasonYear DESC, LastUpdated DESC
    `;

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

async function getPlayerVsPlayerStatistics(playerId1, playerId2) {
    const query = `
        SELECT 
            Player1Id,
            Player1FirstName,
            Player1LastName,
            Player1Position,
            Player1TotalPoints,
            Player1FieldGoalsMade,
            Player1FieldGoalsAttempted,
            Player1ThreePointShotsMade,
            Player1ThreePointShotsAttempted,
            Player1FreeThrowsMade,
            Player1FreeThrowsAttempted,
            Player1TotalRebounds,
            Player1Assists,
            Player1Steals,
            Player1Blocks,
            Player1Turnovers,
            Player1PersonalFouls,
            Player1PlusMinus,
            Player1MinutesPlayed,
            Player2Id,
            Player2FirstName,
            Player2LastName,
            Player2Position,
            Player2TotalPoints,
            Player2FieldGoalsMade,
            Player2FieldGoalsAttempted,
            Player2ThreePointShotsMade,
            Player2ThreePointShotsAttempted,
            Player2FreeThrowsMade,
            Player2FreeThrowsAttempted,
            Player2TotalRebounds,
            Player2Assists,
            Player2Steals,
            Player2Blocks,
            Player2Turnovers,
            Player2PersonalFouls,
            Player2PlusMinus,
            Player2MinutesPlayed,
            GameId,
            GameDate,
            Player1TeamName,
            Player2TeamName,
            SeasonId,
            SeasonYear,
            LastUpdated
        FROM PlayerVsPlayerStats
        WHERE (Player1Id = @playerId1 AND Player2Id = @playerId2)
           OR (Player1Id = @playerId2 AND Player2Id = @playerId1)
        ORDER BY GameDate DESC
    `;

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('playerId1', playerId1);
        request.input('playerId2', playerId2);

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting player vs player statistics:', error);
        await errorLogService.logDatabaseError(error, 'playerStatisticsRepository.js', null, { function: 'getPlayerVsPlayerStatistics', playerId1, playerId2 });
        throw error;
    }
}

async function getPlayerVsAllTeamsStatistics(playerId, seasonId = null) {
    const query = `
        SELECT
            EnemyTeamId,
            EnemyTeamName,
            EnemyTeamNickName,
            SeasonId,
            SeasonYear,
            AveragePoints,
            AverageRebounds,
            AverageAssists,
            AverageSteals,
            AverageBlocks,
            AverageTurnovers,
            AverageFieldGoalsMade,
            AverageFieldGoalsAttempted,
            AverageThreePointShotsMade,
            AverageThreePointShotsAttempted,
            AverageFreeThrowsMade,
            AverageFreeThrowsAttempted,
            MaxPoints,
            MinPoints,
            GamesPlayed,
            GamesOver20Points,
            GamesOver30Points,
            GamesOver40Points,
            LastUpdated
        FROM PlayerVsTeamStats
        WHERE PlayerId = @playerId
          ${seasonId ? 'AND SeasonYear = @seasonId' : ''}
        ORDER BY AveragePoints DESC
    `;

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('playerId', playerId);
        if (seasonId) {
            request.input('seasonId', seasonId);
        }

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting player vs all teams statistics:', error);
        await errorLogService.logDatabaseError(error, 'playerStatisticsRepository.js', null, { function: 'getPlayerVsAllTeamsStatistics', playerId, seasonId });
        throw error;
    }
}

async function getPlayerVsTeamDetailedStatistics(playerId, enemyTeamId, seasonId = null) {
    const query = `
        SELECT
            AVG(CAST(PS.TotalPoints AS FLOAT)) AS AveragePoints,
            AVG(CAST(PS.TotalRebounds AS FLOAT)) AS AverageRebounds,
            AVG(CAST(PS.Assists AS FLOAT)) AS AverageAssists,
            AVG(CAST(PS.Steals AS FLOAT)) AS AverageSteals,
            AVG(CAST(PS.Blocks AS FLOAT)) AS AverageBlocks,
            AVG(CAST(PS.Turnovers AS FLOAT)) AS AverageTurnovers,
            AVG(CAST(PS.FieldGoalsMade AS FLOAT)) AS AverageFieldGoalsMade,
            AVG(CAST(PS.FieldGoalsAttempted AS FLOAT)) AS AverageFieldGoalsAttempted,
            AVG(CAST(PS.ThreePointShotsMade AS FLOAT)) AS AverageThreePointShotsMade,
            AVG(CAST(PS.ThreePointShotsAttempted AS FLOAT)) AS AverageThreePointShotsAttempted,
            AVG(CAST(PS.FreeThrowsMade AS FLOAT)) AS AverageFreeThrowsMade,
            AVG(CAST(PS.FreeThrowsAttempted AS FLOAT)) AS AverageFreeThrowsAttempted,
            AVG(CAST(PS.PersonalFouls AS FLOAT)) AS AveragePersonalFouls,
            AVG(CAST(PS.PlusMinus AS FLOAT)) AS AveragePlusMinus,
            MAX(PS.TotalPoints) AS MaxPoints,
            MIN(PS.TotalPoints) AS MinPoints,
            COUNT(*) AS GamesPlayed,
            SUM(CASE WHEN PS.TotalPoints > 20 THEN 1 ELSE 0 END) AS GamesOver20Points,
            SUM(CASE WHEN PS.TotalPoints > 30 THEN 1 ELSE 0 END) AS GamesOver30Points,
            SUM(CASE WHEN PS.TotalPoints > 40 THEN 1 ELSE 0 END) AS GamesOver40Points,
            T.Name AS EnemyTeamName,
            T.NickName AS EnemyTeamNickName,
            P.FirstName AS PlayerFirstName,
            P.LastName AS PlayerLastName,
            P.Position AS PlayerPosition
        FROM PlayerStats PS
        INNER JOIN Game G ON PS.GameId = G.Id
        INNER JOIN Team T ON T.Id = @enemyTeamId
        INNER JOIN Player P ON P.Id = PS.PlayerId
        WHERE PS.PlayerId = @playerId
          AND PS.Active = 1
          AND G.Active = 1
          AND (
                (PS.TeamId = G.TeamHomeId AND G.TeamVisitorId = @enemyTeamId)
             OR (PS.TeamId = G.TeamVisitorId AND G.TeamHomeId = @enemyTeamId)
              )
          ${seasonId ? 'AND G.SeasonId = @seasonId' : ''}
    `;

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('playerId', playerId);
        request.input('enemyTeamId', enemyTeamId);
        if (seasonId) {
            request.input('seasonId', seasonId);
        }

        const result = await request.query(query);
        return result.recordset[0] || null;
    } catch (error) {
        console.error('Error getting player vs team detailed statistics:', error);
        await errorLogService.logDatabaseError(error, 'playerStatisticsRepository.js', null, { function: 'getPlayerVsTeamDetailedStatistics', playerId, enemyTeamId, seasonId });
        throw error;
    }
}

async function getPlayerVsPositionStatistics(playerId, enemyPosition, seasonId = null) {
    const query = `
        ;WITH JogosDoJogador AS
        (
            SELECT
                PS.GameId,
                CASE
                    WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId
                    ELSE G.TeamHomeId
                END AS EnemyTeamId
            FROM PlayerStats PS
            INNER JOIN Game G ON PS.GameId = G.Id
            WHERE PS.PlayerId = @playerId
              AND PS.Active = 1
              AND G.Active = 1
              ${seasonId ? 'AND G.SeasonId = @seasonId' : ''}
        )
        SELECT
            P.FirstName,
            P.LastName,
            P.Position AS PlayerPosition,
            AVG(CAST(PS.TotalPoints AS FLOAT)) AS AveragePoints,
            AVG(CAST(PS.TotalRebounds AS FLOAT)) AS AverageRebounds,
            AVG(CAST(PS.Assists AS FLOAT)) AS AverageAssists,
            AVG(CAST(PS.Steals AS FLOAT)) AS AverageSteals,
            AVG(CAST(PS.Blocks AS FLOAT)) AS AverageBlocks,
            AVG(CAST(PS.Turnovers AS FLOAT)) AS AverageTurnovers,
            AVG(CAST(PS.FieldGoalsMade AS FLOAT)) AS AverageFieldGoalsMade,
            AVG(CAST(PS.FieldGoalsAttempted AS FLOAT)) AS AverageFieldGoalsAttempted,
            AVG(CAST(PS.ThreePointShotsMade AS FLOAT)) AS AverageThreePointShotsMade,
            AVG(CAST(PS.ThreePointShotsAttempted AS FLOAT)) AS AverageThreePointShotsAttempted,
            AVG(CAST(PS.FreeThrowsMade AS FLOAT)) AS AverageFreeThrowsMade,
            AVG(CAST(PS.FreeThrowsAttempted AS FLOAT)) AS AverageFreeThrowsAttempted,
            MAX(PS.TotalPoints) AS MaxPoints,
            MIN(PS.TotalPoints) AS MinPoints,
            COUNT(DISTINCT PS.GameId) AS GamesAnalyzed,
            SUM(CASE WHEN PS.TotalPoints > 20 THEN 1 ELSE 0 END) AS GamesOver20Points,
            SUM(CASE WHEN PS.TotalPoints > 30 THEN 1 ELSE 0 END) AS GamesOver30Points,
            @enemyPosition AS EnemyPosition
        FROM PlayerStats PS
        INNER JOIN JogosDoJogador JJ ON PS.GameId = JJ.GameId
        INNER JOIN Player P ON P.Id = @playerId
        WHERE PS.PlayerId = @playerId
          AND PS.Active = 1
          AND EXISTS (
                SELECT 1
                FROM PlayerStats O
                WHERE O.GameId = JJ.GameId
                  AND O.TeamId = JJ.EnemyTeamId
                  AND O.Position = @enemyPosition
                  AND O.Active = 1
            )
        GROUP BY P.FirstName, P.LastName, P.Position
    `;

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('playerId', playerId);
        request.input('enemyPosition', enemyPosition);
        if (seasonId) {
            request.input('seasonId', seasonId);
        }

        const result = await request.query(query);
        return result.recordset[0] || null;
    } catch (error) {
        console.error('Error getting player vs position statistics:', error);
        await errorLogService.logDatabaseError(error, 'playerStatisticsRepository.js', null, { function: 'getPlayerVsPositionStatistics', playerId, enemyPosition, seasonId });
        throw error;
    }
}

async function getPlayerInPositionVsTeamStatistics(playerId, enemyTeamId, position, seasonId = null) {
    const query = `
        SELECT
            AVG(CAST(PS.TotalPoints AS FLOAT)) AS AveragePoints,
            AVG(CAST(PS.TotalRebounds AS FLOAT)) AS AverageRebounds,
            AVG(CAST(PS.Assists AS FLOAT)) AS AverageAssists,
            AVG(CAST(PS.Steals AS FLOAT)) AS AverageSteals,
            AVG(CAST(PS.Blocks AS FLOAT)) AS AverageBlocks,
            AVG(CAST(PS.Turnovers AS FLOAT)) AS AverageTurnovers,
            AVG(CAST(PS.FieldGoalsMade AS FLOAT)) AS AverageFieldGoalsMade,
            AVG(CAST(PS.FieldGoalsAttempted AS FLOAT)) AS AverageFieldGoalsAttempted,
            AVG(CAST(PS.ThreePointShotsMade AS FLOAT)) AS AverageThreePointShotsMade,
            AVG(CAST(PS.ThreePointShotsAttempted AS FLOAT)) AS AverageThreePointShotsAttempted,
            AVG(CAST(PS.FreeThrowsMade AS FLOAT)) AS AverageFreeThrowsMade,
            AVG(CAST(PS.FreeThrowsAttempted AS FLOAT)) AS AverageFreeThrowsAttempted,
            AVG(CAST(PS.PersonalFouls AS FLOAT)) AS AveragePersonalFouls,
            AVG(CAST(PS.PlusMinus AS FLOAT)) AS AveragePlusMinus,
            MAX(PS.TotalPoints) AS MaxPoints,
            MIN(PS.TotalPoints) AS MinPoints,
            COUNT(*) AS GamesPlayed,
            SUM(CASE WHEN PS.TotalPoints > 20 THEN 1 ELSE 0 END) AS GamesOver20Points,
            SUM(CASE WHEN PS.TotalPoints > 30 THEN 1 ELSE 0 END) AS GamesOver30Points,
            T.Name AS EnemyTeamName,
            T.NickName AS EnemyTeamNickName,
            P.FirstName AS PlayerFirstName,
            P.LastName AS PlayerLastName,
            PS.Position AS PlayerPosition
        FROM PlayerStats PS
        INNER JOIN Game G ON PS.GameId = G.Id
        INNER JOIN Team T ON T.Id = @enemyTeamId
        INNER JOIN Player P ON P.Id = PS.PlayerId
        WHERE PS.PlayerId = @playerId
          AND PS.Position = @position
          AND PS.Active = 1
          AND G.Active = 1
          AND (
                (PS.TeamId = G.TeamHomeId AND G.TeamVisitorId = @enemyTeamId)
             OR (PS.TeamId = G.TeamVisitorId AND G.TeamHomeId = @enemyTeamId)
              )
          ${seasonId ? 'AND G.SeasonId = @seasonId' : ''}
    `;

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('playerId', playerId);
        request.input('enemyTeamId', enemyTeamId);
        request.input('position', position);
        if (seasonId) {
            request.input('seasonId', seasonId);
        }

        const result = await request.query(query);
        return result.recordset[0] || null;
    } catch (error) {
        console.error('Error getting player in position vs team statistics:', error);
        await errorLogService.logDatabaseError(error, 'playerStatisticsRepository.js', null, { function: 'getPlayerInPositionVsTeamStatistics', playerId, enemyTeamId, position, seasonId });
        throw error;
    }
}

async function getPlayerInPositionVsAllTeamsStatistics(playerId, position, seasonId = null) {
    const query = `
        SELECT
            CASE
                WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId
                ELSE G.TeamHomeId
            END AS EnemyTeamId,
            T.Name AS EnemyTeamName,
            T.NickName AS EnemyTeamNickName,
            AVG(CAST(PS.TotalPoints AS FLOAT)) AS AveragePoints,
            AVG(CAST(PS.TotalRebounds AS FLOAT)) AS AverageRebounds,
            AVG(CAST(PS.Assists AS FLOAT)) AS AverageAssists,
            AVG(CAST(PS.Steals AS FLOAT)) AS AverageSteals,
            AVG(CAST(PS.Blocks AS FLOAT)) AS AverageBlocks,
            AVG(CAST(PS.Turnovers AS FLOAT)) AS AverageTurnovers,
            AVG(CAST(PS.FieldGoalsMade AS FLOAT)) AS AverageFieldGoalsMade,
            AVG(CAST(PS.FieldGoalsAttempted AS FLOAT)) AS AverageFieldGoalsAttempted,
            AVG(CAST(PS.ThreePointShotsMade AS FLOAT)) AS AverageThreePointShotsMade,
            AVG(CAST(PS.ThreePointShotsAttempted AS FLOAT)) AS AverageThreePointShotsAttempted,
            AVG(CAST(PS.FreeThrowsMade AS FLOAT)) AS AverageFreeThrowsMade,
            AVG(CAST(PS.FreeThrowsAttempted AS FLOAT)) AS AverageFreeThrowsAttempted,
            MAX(PS.TotalPoints) AS MaxPoints,
            MIN(PS.TotalPoints) AS MinPoints,
            COUNT(*) AS GamesPlayed,
            SUM(CASE WHEN PS.TotalPoints > 20 THEN 1 ELSE 0 END) AS GamesOver20Points,
            SUM(CASE WHEN PS.TotalPoints > 30 THEN 1 ELSE 0 END) AS GamesOver30Points,
            SUM(CASE WHEN PS.TotalPoints > 40 THEN 1 ELSE 0 END) AS GamesOver40Points
        FROM PlayerStats PS
        INNER JOIN Game G ON PS.GameId = G.Id
        INNER JOIN Team T ON T.Id = CASE
                     WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId
                     ELSE G.TeamHomeId
                  END
        WHERE PS.PlayerId = @playerId
          AND PS.Position = @position
          AND PS.Active = 1
          AND G.Active = 1
          ${seasonId ? 'AND G.SeasonId = @seasonId' : ''}
        GROUP BY
            CASE
                WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId
                ELSE G.TeamHomeId
            END,
            T.Name,
            T.NickName
        ORDER BY AveragePoints DESC
    `;

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('playerId', playerId);
        request.input('position', position);
        if (seasonId) {
            request.input('seasonId', seasonId);
        }

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting player in position vs all teams statistics:', error);
        await errorLogService.logDatabaseError(error, 'playerStatisticsRepository.js', null, { function: 'getPlayerInPositionVsAllTeamsStatistics', playerId, position, seasonId });
        throw error;
    }
}

module.exports.getPlayerVsTeamStatistics = getPlayerVsTeamStatistics;
module.exports.getPlayerVsPlayerStatistics = getPlayerVsPlayerStatistics;
module.exports.getPlayerVsAllTeamsStatistics = getPlayerVsAllTeamsStatistics;
module.exports.getPlayerVsTeamDetailedStatistics = getPlayerVsTeamDetailedStatistics;
module.exports.getPlayerVsPositionStatistics = getPlayerVsPositionStatistics;
module.exports.getPlayerInPositionVsTeamStatistics = getPlayerInPositionVsTeamStatistics;
module.exports.getPlayerInPositionVsAllTeamsStatistics = getPlayerInPositionVsAllTeamsStatistics;

/**
 * Unified player statistics query with flexible parameters
 * @param {Object} params - Query parameters
 * @param {number} params.playerId - Player ID (required)
 * @param {number} [params.enemyTeamId] - Enemy team ID (optional)
 * @param {string} [params.enemyPosition] - Enemy position (optional)
 * @param {string} [params.playerPosition] - Player position (optional)
 * @param {number} [params.seasonId] - Season ID (optional)
 * @param {string} [params.queryType] - Type of query: 'vs-team', 'vs-position', 'vs-all-teams', 'in-position-vs-team', 'in-position-vs-all-teams', 'vs-player'
 * @param {number} [params.playerId2] - Second player ID for vs-player queries
 * @param {Array} [params.fields] - Array of fields to return (optional, defaults to all)
 * @param {string} [params.groupBy] - Group by: 'team', 'position', 'game', 'season' (optional)
 * @param {string} [params.orderBy] - Order by field (optional, defaults to 'AveragePoints')
 * @param {string} [params.orderDirection] - Order direction: 'ASC' or 'DESC' (optional, defaults to 'DESC')
 * @param {number} [params.limit] - Limit results (optional)
 */
async function getPlayerStatistics(params) {
    const {
        playerId,
        enemyTeamId,
        enemyPosition,
        playerPosition,
        seasonId,
        queryType = 'vs-all-teams',
        playerId2,
        fields = [],
        groupBy = 'team',
        orderBy = 'AveragePoints',
        orderDirection = 'DESC',
        limit
    } = params;

    if (!playerId) {
        throw new Error('Player ID is required');
    }

    // Default fields if none specified
    const defaultFields = [
        'PlayerId', 'PlayerFirstName', 'PlayerLastName', 'PlayerPosition',
        'EnemyTeamId', 'EnemyTeamName', 'EnemyTeamNickName',
        'SeasonId', 'SeasonYear', 'AveragePoints', 'AverageRebounds',
        'AverageAssists', 'AverageSteals', 'AverageBlocks', 'AverageTurnovers',
        'AverageFieldGoalsMade', 'AverageFieldGoalsAttempted',
        'AverageThreePointShotsMade', 'AverageThreePointShotsAttempted',
        'AverageFreeThrowsMade', 'AverageFreeThrowsAttempted',
        'MaxPoints', 'MinPoints', 'GamesPlayed', 'GamesOver20Points',
        'GamesOver30Points', 'GamesOver40Points', 'LastUpdated'
    ];

    const selectedFields = fields.length > 0 ? fields : defaultFields;
    const fieldsString = selectedFields.join(', ');

    let query = '';
    let whereConditions = ['PlayerId = @playerId'];
    let orderByClause = `ORDER BY ${orderBy} ${orderDirection}`;

    // Build query based on query type
    switch (queryType) {
        case 'vs-team':
            if (!enemyTeamId) {
                throw new Error('Enemy team ID is required for vs-team query');
            }
            query = `SELECT ${fieldsString} FROM PlayerVsTeamStats`;
            whereConditions.push('EnemyTeamId = @enemyTeamId');
            break;

        case 'vs-position':
            if (!enemyPosition) {
                throw new Error('Enemy position is required for vs-position query');
            }
            query = `SELECT ${fieldsString} FROM PlayerVsPositionStats`;
            whereConditions.push('EnemyPosition = @enemyPosition');
            break;

        case 'vs-all-teams':
            query = `SELECT ${fieldsString} FROM PlayerVsTeamStats`;
            break;

        case 'in-position-vs-team':
            if (!enemyTeamId || !playerPosition) {
                throw new Error('Enemy team ID and player position are required for in-position-vs-team query');
            }
            query = `SELECT ${fieldsString} FROM PlayerPositionStats`;
            whereConditions.push('EnemyTeamId = @enemyTeamId');
            whereConditions.push('PlayerPosition = @playerPosition');
            break;

        case 'in-position-vs-all-teams':
            if (!playerPosition) {
                throw new Error('Player position is required for in-position-vs-all-teams query');
            }
            query = `SELECT ${fieldsString} FROM PlayerPositionStats`;
            whereConditions.push('PlayerPosition = @playerPosition');
            break;

        case 'vs-player':
            if (!playerId2) {
                throw new Error('Second player ID is required for vs-player query');
            }
            // For vs-player, we need to use the PlayerVsPlayerStats view
            const vsPlayerFields = [
                'Player1Id', 'Player1FirstName', 'Player1LastName', 'Player1Position',
                'Player1TotalPoints', 'Player1TotalRebounds', 'Player1Assists',
                'Player1Steals', 'Player1Blocks', 'Player1Turnovers',
                'Player2Id', 'Player2FirstName', 'Player2LastName', 'Player2Position',
                'Player2TotalPoints', 'Player2TotalRebounds', 'Player2Assists',
                'Player2Steals', 'Player2Blocks', 'Player2Turnovers',
                'GameId', 'GameDate', 'Player1TeamName', 'Player2TeamName',
                'SeasonId', 'SeasonYear', 'LastUpdated'
            ];
            const vsPlayerFieldsString = vsPlayerFields.join(', ');
            query = `SELECT ${vsPlayerFieldsString} FROM PlayerVsPlayerStats`;
            whereConditions.push('(Player1Id = @playerId AND Player2Id = @playerId2) OR (Player1Id = @playerId2 AND Player2Id = @playerId)');
            orderByClause = 'ORDER BY GameDate DESC';
            break;

        default:
            throw new Error(`Invalid query type: ${queryType}`);
    }

    // Add season filter if provided
    if (seasonId) {
        whereConditions.push('SeasonYear = @seasonId');
    }

    // Add group by if specified
    if (groupBy && queryType !== 'vs-player') {
        switch (groupBy) {
            case 'team':
                orderByClause = 'ORDER BY EnemyTeamName, ' + orderByClause.split('ORDER BY ')[1];
                break;
            case 'position':
                orderByClause = 'ORDER BY PlayerPosition, ' + orderByClause.split('ORDER BY ')[1];
                break;
            case 'season':
                orderByClause = 'ORDER BY SeasonYear DESC, ' + orderByClause.split('ORDER BY ')[1];
                break;
        }
    }

    // Add limit if specified
    if (limit) {
        orderByClause += ` OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY`;
    }

    const finalQuery = `${query} WHERE ${whereConditions.join(' AND ')} ${orderByClause}`;

    try {
        const pool = await getPool();
        const request = pool.request();

        request.input('playerId', playerId);
        if (enemyTeamId) request.input('enemyTeamId', enemyTeamId);
        if (enemyPosition) request.input('enemyPosition', enemyPosition);
        if (playerPosition) request.input('playerPosition', playerPosition);
        if (seasonId) request.input('seasonId', seasonId);
        if (playerId2) request.input('playerId2', playerId2);

        const result = await request.query(finalQuery);
        return result.recordset;
    } catch (error) {
        console.error('Error getting unified player statistics:', error);
        await errorLogService.logDatabaseError(
            error,
            'playerStatisticsRepository.js',
            null,
            { function: 'getPlayerStatistics', params }
        );
        throw error;
    }
}

module.exports.getPlayerStatistics = getPlayerStatistics;

/**
 * Get player vs team statistics grouped by individual games
 * @param {number} playerId - Player ID
 * @param {number} enemyTeamId - Enemy team ID
 * @param {Object} filters - Filter options
 * @param {number} [filters.seasonId] - Season ID filter
 * @param {string} [filters.arena] - Arena name filter
 * @param {string} [filters.statType] - Stat type for over/under filter (points, rebounds, assists, etc.)
 * @param {number} [filters.overValue] - Over value for stat filter
 * @param {number} [filters.underValue] - Under value for stat filter
 * @param {string} [filters.orderBy] - Order by field (default: 'GameDate')
 * @param {string} [filters.orderDirection] - Order direction (default: 'DESC')
 * @param {number} [filters.limit] - Limit results
 */
async function getPlayerVsTeamGameStatistics(playerId, enemyTeamId, filters = {}) {
    const {
        seasonId,
        arena,
        statType = 'TotalPoints',
        overValue,
        underValue,
        orderBy = 'GameDate',
        orderDirection = 'DESC',
        limit
    } = filters;

    let whereConditions = [
        'PS.PlayerId = @playerId',
        'PS.Active = 1',
        'G.Active = 1'
    ];

    // Add enemy team condition
    whereConditions.push(`
        (
            (PS.TeamId = G.TeamHomeId AND G.TeamVisitorId = @enemyTeamId)
            OR (PS.TeamId = G.TeamVisitorId AND G.TeamHomeId = @enemyTeamId)
        )
    `);

    // Add season filter
    if (seasonId) {
        whereConditions.push('G.SeasonId = @seasonId');
    }

    // Note: Arena column doesn't exist in Game table, so arena filter is disabled
    // if (arena) {
    //     whereConditions.push('G.Arena LIKE @arena');
    // }

    // Add over/under filters
    if (overValue !== undefined) {
        whereConditions.push(`PS.${statType} >= @overValue`);
    }
    if (underValue !== undefined) {
        whereConditions.push(`PS.${statType} <= @underValue`);
    }

    const query = `
        SELECT 
            PS.GameId,
            G.StartDate AS GameDate,
            NULL AS Arena,
            G.SeasonId,
            S.Year AS SeasonYear,
            PS.TotalPoints,
            PS.TotalRebounds,
            PS.Assists,
            PS.Steals,
            PS.Blocks,
            PS.Turnovers,
            PS.FieldGoalsMade,
            PS.FieldGoalsAttempted,
            PS.FieldGoalPercentage,
            PS.ThreePointShotsMade,
            PS.ThreePointShotsAttempted,
            PS.ThreePointShotPercentage,
            PS.FreeThrowsMade,
            PS.FreeThrowsAttempted,
            PS.FreeThrowPercentage,
            PS.PersonalFouls,
            PS.PlusMinus,
            PS.MinutesPlayed,
            PS.Position AS PlayerPosition,
            P.FirstName AS PlayerFirstName,
            P.LastName AS PlayerLastName,
            T.Name AS EnemyTeamName,
            T.NickName AS EnemyTeamNickName,
            CASE 
                WHEN PS.TeamId = G.TeamHomeId THEN 'Home'
                ELSE 'Away'
            END AS GameLocation,
            CASE 
                WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId
                ELSE G.TeamHomeId
            END AS EnemyTeamId
        FROM PlayerStats PS
        INNER JOIN Game G ON PS.GameId = G.Id
        INNER JOIN Season S ON G.SeasonId = S.Id
        INNER JOIN Player P ON P.Id = PS.PlayerId
        INNER JOIN Team T ON T.Id = CASE 
            WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId
            ELSE G.TeamHomeId
        END
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY ${orderBy} ${orderDirection}
        ${limit ? `OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY` : ''}
    `;

    try {
        const pool = await getPool();
        const request = pool.request();

        request.input('playerId', playerId);
        request.input('enemyTeamId', enemyTeamId);

        if (seasonId) request.input('seasonId', seasonId);
        // Arena filter disabled - column doesn't exist
        // if (arena) request.input('arena', `%${arena}%`);
        if (overValue !== undefined) request.input('overValue', overValue);
        if (underValue !== undefined) request.input('underValue', underValue);

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting player vs team game statistics:', error);
        await errorLogService.logDatabaseError(
            error,
            'playerStatisticsRepository.js',
            null,
            { function: 'getPlayerVsTeamGameStatistics', playerId, enemyTeamId, filters }
        );
        throw error;
    }
}

module.exports.getPlayerVsTeamGameStatistics = getPlayerVsTeamGameStatistics;

/**
 * Get team vs team player statistics - all players from both teams with their stats against each other
 * @param {number} teamId1 - First team ID
 * @param {number} teamId2 - Second team ID
 * @param {Object} filters - Filter options
 * @param {number} [filters.seasonId] - Season ID filter
 * @param {string} [filters.position] - Position filter
 * @param {string} [filters.orderBy] - Order by field (default: 'AveragePoints')
 * @param {string} [filters.orderDirection] - Order direction (default: 'DESC')
 * @param {number} [filters.limit] - Limit results
 */
async function getTeamVsTeamPlayerStatistics(teamId1, teamId2, filters = {}) {
    const {
        seasonId,
        position,
        orderBy = 'AveragePoints',
        orderDirection = 'DESC',
        limit
    } = filters;

    let whereConditions = [
        '((TeamId = @teamId1 AND EnemyTeamId = @teamId2) OR (TeamId = @teamId2 AND EnemyTeamId = @teamId1))'
    ];

    // Add season filter
    if (seasonId) {
        whereConditions.push('SeasonId = @seasonId');
    }

    // Add position filter
    if (position) {
        whereConditions.push('Position = @position');
    }

    const query = `
        SELECT 
            PlayerId,
            FirstName,
            LastName,
            Position,
            TeamId,
            TeamName,
            TeamNickName,
            EnemyTeamId,
            EnemyTeamName,
            EnemyTeamNickName,
            SeasonId,
            SeasonYear,
            AveragePoints,
            AverageRebounds,
            AverageAssists,
            AverageSteals,
            AverageBlocks,
            AverageTurnovers,
            AveragePersonalFouls,
            AveragePointsPlusRebounds,
            AveragePointsPlusReboundsPlusAssists,
            AveragePointsPlusAssists,
            AverageAssistsPlusRebounds,
            AverageOverPoints,
            GamesOver20Points,
            GamesOver25Points,
            GamesOver30Points,
            GamesOver35Points,
            GamesOver40Points,
            GamesOver5Rebounds,
            GamesOver10Rebounds,
            GamesOver15Rebounds,
            GamesOver5Assists,
            GamesOver10Assists,
            GamesOver15Assists,
            AverageFieldGoalsMade,
            AverageFieldGoalsAttempted,
            AverageThreePointShotsMade,
            AverageThreePointShotsAttempted,
            AverageFreeThrowsMade,
            AverageFreeThrowsAttempted,
            FieldGoalPercentage,
            ThreePointPercentage,
            FreeThrowPercentage,
            MaxPoints,
            MinPoints,
            MaxRebounds,
            MinRebounds,
            MaxAssists,
            MinAssists,
            GamesPlayed,
            HomeGames,
            AwayGames,
            RecentAveragePoints,
            RecentAverageRebounds,
            RecentAverageAssists,
            PointsStandardDeviation,
            ReboundsStandardDeviation,
            AssistsStandardDeviation,
            LastUpdated
        FROM TeamVsTeamPlayerStats
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY ${orderBy} ${orderDirection}
        ${limit ? `OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY` : ''}
    `;

    try {
        const pool = await getPool();
        const request = pool.request();

        request.input('teamId1', teamId1);
        request.input('teamId2', teamId2);

        if (seasonId) request.input('seasonId', seasonId);
        if (position) request.input('position', position);

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting team vs team player statistics:', error);
        await errorLogService.logDatabaseError(
            error,
            'playerStatisticsRepository.js',
            null,
            { function: 'getTeamVsTeamPlayerStatistics', teamId1, teamId2, filters }
        );
        throw error;
    }
}

module.exports.getTeamVsTeamPlayerStatistics = getTeamVsTeamPlayerStatistics;