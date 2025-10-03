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
          ${seasonId ? 'AND SeasonId = @seasonId' : ''}
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
