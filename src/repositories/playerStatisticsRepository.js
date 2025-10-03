const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

async function getPlayerVsTeamStatistics(playerId, teamId) {
    const query = `
  
  `;

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('playerId', playerId);
        request.input('teamId', teamId);

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting player vs team statistics:', error);
        await errorLogService.logDatabaseError(error, 'playerStatisticsRepository.js', null, { function: 'getPlayerVsTeamStatistics', playerId, teamId });
        throw error;
    }
}

async function getPlayerVsPlayerStatistics(playerId1, playerId2) {
    const query = `
        SELECT 
            ps1.PlayerId as Player1Id,
            p1.FirstName as Player1FirstName,
            p1.LastName as Player1LastName,
            p1.Position as Player1Position,
            ps1.TotalPoints as Player1TotalPoints,
            ps1.FieldGoalsMade as Player1FieldGoalsMade,
            ps1.FieldGoalsAttempted as Player1FieldGoalsAttempted,
            ps1.ThreePointShotsMade as Player1ThreePointShotsMade,
            ps1.ThreePointShotsAttempted as Player1ThreePointShotsAttempted,
            ps1.FreeThrowsMade as Player1FreeThrowsMade,
            ps1.FreeThrowsAttempted as Player1FreeThrowsAttempted,
            ps1.TotalRebounds as Player1TotalRebounds,
            ps1.Assists as Player1Assists,
            ps1.Steals as Player1Steals,
            ps1.Blocks as Player1Blocks,
            ps1.Turnovers as Player1Turnovers,
            ps1.PersonalFouls as Player1PersonalFouls,
            ps1.PlusMinus as Player1PlusMinus,
            ps1.MinutesPlayed as Player1MinutesPlayed,
            ps2.PlayerId as Player2Id,
            p2.FirstName as Player2FirstName,
            p2.LastName as Player2LastName,
            p2.Position as Player2Position,
            ps2.TotalPoints as Player2TotalPoints,
            ps2.FieldGoalsMade as Player2FieldGoalsMade,
            ps2.FieldGoalsAttempted as Player2FieldGoalsAttempted,
            ps2.ThreePointShotsMade as Player2ThreePointShotsMade,
            ps2.ThreePointShotsAttempted as Player2ThreePointShotsAttempted,
            ps2.FreeThrowsMade as Player2FreeThrowsMade,
            ps2.FreeThrowsAttempted as Player2FreeThrowsAttempted,
            ps2.TotalRebounds as Player2TotalRebounds,
            ps2.Assists as Player2Assists,
            ps2.Steals as Player2Steals,
            ps2.Blocks as Player2Blocks,
            ps2.Turnovers as Player2Turnovers,
            ps2.PersonalFouls as Player2PersonalFouls,
            ps2.PlusMinus as Player2PlusMinus,
            ps2.MinutesPlayed as Player2MinutesPlayed,
            g.Id as GameId,
            g.StartDate as GameDate,
            t1.Name as Player1TeamName,
            t2.Name as Player2TeamName
        FROM PlayerStats ps1
        INNER JOIN Player p1 ON ps1.PlayerId = p1.Id
        INNER JOIN PlayerStats ps2 ON ps1.GameId = ps2.GameId AND ps1.PlayerId != ps2.PlayerId
        INNER JOIN Player p2 ON ps2.PlayerId = p2.Id
        INNER JOIN Game g ON ps1.GameId = g.Id
        INNER JOIN Team t1 ON ps1.TeamId = t1.Id
        INNER JOIN Team t2 ON ps2.TeamId = t2.Id
        WHERE ps1.PlayerId = @playerId1 
            AND ps2.PlayerId = @playerId2
            AND ps1.Active = 1 
            AND ps2.Active = 1
            AND g.Active = 1
        ORDER BY g.StartDate DESC
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
            SUM(CASE WHEN PS.TotalPoints > 30 THEN 1 ELSE 0 END) AS GamesOver30Points
        FROM PlayerStats PS
        INNER JOIN Game G ON PS.GameId = G.Id
        INNER JOIN Team T ON T.Id = CASE
                     WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId
                     ELSE G.TeamHomeId
                  END
        WHERE PS.PlayerId = @playerId
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
