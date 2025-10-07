-- =====================================================
-- MATERIALIZED VIEWS FOR PLAYER STATISTICS (DBeaver Compatible)
-- =====================================================
-- This script creates materialized views to improve query performance
-- for player statistics endpoints
-- NOTE: This version fixes DBeaver compatibility issues

-- =====================================================
-- 1. PLAYER VS TEAM STATISTICS VIEW
-- =====================================================
-- Drop the view if it exists
IF EXISTS (SELECT * FROM sys.views WHERE name = 'PlayerVsTeamStats')
    DROP VIEW PlayerVsTeamStats;

-- Create the view
CREATE VIEW PlayerVsTeamStats AS
SELECT 
    PS.PlayerId,
    P.FirstName AS PlayerFirstName,
    P.LastName AS PlayerLastName,
    P.Position AS PlayerPosition,
    CASE 
        WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId 
        ELSE G.TeamHomeId 
    END AS EnemyTeamId,
    T.Name AS EnemyTeamName,
    T.NickName AS EnemyTeamNickName,
    G.SeasonId,
    S.Year AS SeasonYear,
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
    GETDATE() AS LastUpdated
FROM PlayerStats PS
INNER JOIN Game G ON PS.GameId = G.Id
INNER JOIN Player P ON P.Id = PS.PlayerId
INNER JOIN Team T ON T.Id = CASE 
    WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId 
    ELSE G.TeamHomeId 
END
INNER JOIN Season S ON S.Id = G.SeasonId
WHERE PS.Active = 1 
  AND G.Active = 1 
  AND P.Active = 1 
  AND T.Active = 1
GROUP BY 
    PS.PlayerId,
    P.FirstName,
    P.LastName,
    P.Position,
    CASE WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId ELSE G.TeamHomeId END,
    T.Name,
    T.NickName,
    G.SeasonId,
    S.Year;

-- =====================================================
-- 2. PLAYER POSITION STATISTICS VIEW
-- =====================================================
-- Drop the view if it exists
IF EXISTS (SELECT * FROM sys.views WHERE name = 'PlayerPositionStats')
    DROP VIEW PlayerPositionStats;

-- Create the view
CREATE VIEW PlayerPositionStats AS
SELECT 
    PS.PlayerId,
    P.FirstName AS PlayerFirstName,
    P.LastName AS PlayerLastName,
    PS.Position AS PlayerPosition,
    CASE 
        WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId 
        ELSE G.TeamHomeId 
    END AS EnemyTeamId,
    T.Name AS EnemyTeamName,
    T.NickName AS EnemyTeamNickName,
    G.SeasonId,
    S.Year AS SeasonYear,
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
    GETDATE() AS LastUpdated
FROM PlayerStats PS
INNER JOIN Game G ON PS.GameId = G.Id
INNER JOIN Player P ON P.Id = PS.PlayerId
INNER JOIN Team T ON T.Id = CASE 
    WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId 
    ELSE G.TeamHomeId 
END
INNER JOIN Season S ON S.Id = G.SeasonId
WHERE PS.Active = 1 
  AND G.Active = 1 
  AND P.Active = 1 
  AND T.Active = 1
GROUP BY 
    PS.PlayerId,
    P.FirstName,
    P.LastName,
    PS.Position,
    CASE WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId ELSE G.TeamHomeId END,
    T.Name,
    T.NickName,
    G.SeasonId,
    S.Year;

-- =====================================================
-- 3. PLAYER VS POSITION STATISTICS VIEW
-- =====================================================
-- Drop the view if it exists
IF EXISTS (SELECT * FROM sys.views WHERE name = 'PlayerVsPositionStats')
    DROP VIEW PlayerVsPositionStats;

-- Create the view
CREATE VIEW PlayerVsPositionStats AS
WITH PlayerGames AS (
    SELECT 
        PS.PlayerId, 
        PS.GameId, 
        CASE 
            WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId 
            ELSE G.TeamHomeId 
        END AS EnemyTeamId,
        G.SeasonId
    FROM PlayerStats PS
    INNER JOIN Game G ON PS.GameId = G.Id
    WHERE PS.Active = 1 AND G.Active = 1
)
SELECT 
    PG.PlayerId,
    P.FirstName AS PlayerFirstName,
    P.LastName AS PlayerLastName,
    P.Position AS PlayerPosition,
    O.Position AS EnemyPosition,
    PG.SeasonId,
    S.Year AS SeasonYear,
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
    GETDATE() AS LastUpdated
FROM PlayerGames PG
INNER JOIN PlayerStats PS ON PS.PlayerId = PG.PlayerId AND PS.GameId = PG.GameId
INNER JOIN Player P ON P.Id = PS.PlayerId
INNER JOIN PlayerStats O ON O.GameId = PG.GameId AND O.TeamId = PG.EnemyTeamId
INNER JOIN Season S ON S.Id = PG.SeasonId
WHERE PS.Active = 1 
  AND O.Active = 1 
  AND P.Active = 1
GROUP BY 
    PG.PlayerId,
    P.FirstName,
    P.LastName,
    P.Position,
    O.Position,
    PG.SeasonId,
    S.Year;

-- =====================================================
-- 4. PLAYER VS PLAYER STATISTICS VIEW
-- =====================================================
-- Drop the view if it exists
IF EXISTS (SELECT * FROM sys.views WHERE name = 'PlayerVsPlayerStats')
    DROP VIEW PlayerVsPlayerStats;

-- Create the view
CREATE VIEW PlayerVsPlayerStats AS
SELECT 
    PS1.PlayerId AS Player1Id,
    P1.FirstName AS Player1FirstName,
    P1.LastName AS Player1LastName,
    P1.Position AS Player1Position,
    PS2.PlayerId AS Player2Id,
    P2.FirstName AS Player2FirstName,
    P2.LastName AS Player2LastName,
    P2.Position AS Player2Position,
    G.Id AS GameId,
    G.StartDate AS GameDate,
    T1.Name AS Player1TeamName,
    T2.Name AS Player2TeamName,
    G.SeasonId,
    S.Year AS SeasonYear,
    PS1.TotalPoints AS Player1TotalPoints,
    PS1.FieldGoalsMade AS Player1FieldGoalsMade,
    PS1.FieldGoalsAttempted AS Player1FieldGoalsAttempted,
    PS1.ThreePointShotsMade AS Player1ThreePointShotsMade,
    PS1.ThreePointShotsAttempted AS Player1ThreePointShotsAttempted,
    PS1.FreeThrowsMade AS Player1FreeThrowsMade,
    PS1.FreeThrowsAttempted AS Player1FreeThrowsAttempted,
    PS1.TotalRebounds AS Player1TotalRebounds,
    PS1.Assists AS Player1Assists,
    PS1.Steals AS Player1Steals,
    PS1.Blocks AS Player1Blocks,
    PS1.Turnovers AS Player1Turnovers,
    PS1.PersonalFouls AS Player1PersonalFouls,
    PS1.PlusMinus AS Player1PlusMinus,
    PS1.MinutesPlayed AS Player1MinutesPlayed,
    PS2.TotalPoints AS Player2TotalPoints,
    PS2.FieldGoalsMade AS Player2FieldGoalsMade,
    PS2.FieldGoalsAttempted AS Player2FieldGoalsAttempted,
    PS2.ThreePointShotsMade AS Player2ThreePointShotsMade,
    PS2.ThreePointShotsAttempted AS Player2ThreePointShotsAttempted,
    PS2.FreeThrowsMade AS Player2FreeThrowsMade,
    PS2.FreeThrowsAttempted AS Player2FreeThrowsAttempted,
    PS2.TotalRebounds AS Player2TotalRebounds,
    PS2.Assists AS Player2Assists,
    PS2.Steals AS Player2Steals,
    PS2.Blocks AS Player2Blocks,
    PS2.Turnovers AS Player2Turnovers,
    PS2.PersonalFouls AS Player2PersonalFouls,
    PS2.PlusMinus AS Player2PlusMinus,
    PS2.MinutesPlayed AS Player2MinutesPlayed,
    GETDATE() AS LastUpdated
FROM PlayerStats PS1
INNER JOIN Player P1 ON PS1.PlayerId = P1.Id
INNER JOIN PlayerStats PS2 ON PS1.GameId = PS2.GameId AND PS1.PlayerId != PS2.PlayerId
INNER JOIN Player P2 ON PS2.PlayerId = P2.Id
INNER JOIN Game G ON PS1.GameId = G.Id
INNER JOIN Team T1 ON PS1.TeamId = T1.Id
INNER JOIN Team T2 ON PS2.TeamId = T2.Id
INNER JOIN Season S ON S.Id = G.SeasonId
WHERE PS1.Active = 1 
  AND PS2.Active = 1 
  AND G.Active = 1 
  AND P1.Active = 1 
  AND P2.Active = 1;

PRINT 'Materialized views created successfully!';
