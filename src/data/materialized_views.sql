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

-- =====================================================
-- 5. PLAYER CURRENT TEAM VIEW
-- =====================================================
-- Drop the view if it exists
IF EXISTS (SELECT * FROM sys.views WHERE name = 'VW_PLAYER_CURRENT_TEAM')
    DROP VIEW VW_PLAYER_CURRENT_TEAM;

-- Create the view
CREATE VIEW VW_PLAYER_CURRENT_TEAM AS
SELECT
    P.Id AS PLAYER_ID,
    P.FirstName,
    P.LastName,
    T.Id AS TEAM_ID,
    T.Name AS TEAM_NAME,
    P.Photo AS PLAYER_PHOTO,
    LastTeam.PlayerStatsId AS PLAYERSTATS_ID,
    LastTeam.StartDate AS LAST_GAME_DATE
FROM Player AS P
CROSS APPLY (
    SELECT TOP 1
        PS.Id AS PlayerStatsId,
        PS.TeamId,
        G.StartDate
    FROM PlayerStats AS PS
    INNER JOIN Game AS G ON G.Id = PS.GameId
    WHERE PS.PlayerId = P.Id
      AND PS.Active = 1
      AND G.Active = 1
    ORDER BY G.StartDate DESC, G.Id DESC, PS.Id DESC
) AS LastTeam
INNER JOIN Team AS T ON T.Id = LastTeam.TeamId
WHERE T.Active = 1;

-- =====================================================
-- 6. TEAM VS TEAM PLAYER STATISTICS VIEW
-- =====================================================
-- Drop the view if it exists
IF EXISTS (SELECT * FROM sys.views WHERE name = 'TeamVsTeamPlayerStats')
    DROP VIEW TeamVsTeamPlayerStats;

-- Create the view
CREATE VIEW TeamVsTeamPlayerStats AS
WITH TeamMatchups AS (
    -- Get all games between two teams
    SELECT 
        G.Id AS GameId,
        G.StartDate AS GameDate,
        G.SeasonId,
        S.Year AS SeasonYear,
        G.TeamHomeId,
        G.TeamVisitorId,
        T1.Name AS HomeTeamName,
        T1.NickName AS HomeTeamNickName,
        T2.Name AS VisitorTeamName,
        T2.NickName AS VisitorTeamNickName
    FROM Game G
    INNER JOIN Season S ON G.SeasonId = S.Id
    INNER JOIN Team T1 ON G.TeamHomeId = T1.Id
    INNER JOIN Team T2 ON G.TeamVisitorId = T2.Id
    WHERE G.Active = 1
),
PlayerStatsInMatchups AS (
    -- Get player stats for all games in team matchups
    SELECT 
        PS.PlayerId,
        P.FirstName,
        P.LastName,
        P.Position,
        PS.TeamId,
        PS.GameId,
        PS.TotalPoints,
        PS.TotalRebounds,
        PS.Assists,
        PS.Steals,
        PS.Blocks,
        PS.Turnovers,
        PS.FieldGoalsMade,
        PS.FieldGoalsAttempted,
        PS.ThreePointShotsMade,
        PS.ThreePointShotsAttempted,
        PS.FreeThrowsMade,
        PS.FreeThrowsAttempted,
        PS.PersonalFouls,
        PS.PlusMinus,
        PS.MinutesPlayed,
        TM.SeasonId,
        TM.SeasonYear,
        TM.TeamHomeId,
        TM.TeamVisitorId,
        TM.HomeTeamName,
        TM.HomeTeamNickName,
        TM.VisitorTeamName,
        TM.VisitorTeamNickName,
        CASE 
            WHEN PS.TeamId = TM.TeamHomeId THEN TM.TeamVisitorId
            ELSE TM.TeamHomeId
        END AS EnemyTeamId,
        CASE 
            WHEN PS.TeamId = TM.TeamHomeId THEN TM.VisitorTeamName
            ELSE TM.HomeTeamName
        END AS EnemyTeamName,
        CASE 
            WHEN PS.TeamId = TM.TeamHomeId THEN TM.VisitorTeamNickName
            ELSE TM.HomeTeamNickName
        END AS EnemyTeamNickName,
        CASE 
            WHEN PS.TeamId = TM.TeamHomeId THEN 'Home'
            ELSE 'Away'
        END AS GameLocation
    FROM PlayerStats PS
    INNER JOIN Player P ON PS.PlayerId = P.Id
    INNER JOIN TeamMatchups TM ON PS.GameId = TM.GameId
    WHERE PS.Active = 1
      AND P.Active = 1
)
SELECT 
    PlayerId,
    FirstName,
    LastName,
    Position,
    GameId,
    (select TEAM_ID from VW_PLAYER_CURRENT_TEAM where PLAYER_ID = PlayerStatsInMatchups.PlayerId) as TeamId,
    CASE 
        WHEN TeamId = TeamHomeId THEN HomeTeamName
        ELSE VisitorTeamName
    END AS TeamName,
    CASE 
        WHEN TeamId = TeamHomeId THEN HomeTeamNickName
        ELSE VisitorTeamNickName
    END AS TeamNickName,
    EnemyTeamId,
    EnemyTeamName,
    EnemyTeamNickName,
    SeasonId,
    SeasonYear,

    -- Basic Statistics
    AVG(CAST(TotalPoints AS FLOAT)) AS AveragePoints,
    AVG(CAST(TotalRebounds AS FLOAT)) AS AverageRebounds,
    AVG(CAST(Assists AS FLOAT)) AS AverageAssists,
    AVG(CAST(Steals AS FLOAT)) AS AverageSteals,
    AVG(CAST(Blocks AS FLOAT)) AS AverageBlocks,
    AVG(CAST(Turnovers AS FLOAT)) AS AverageTurnovers,
    AVG(CAST(PersonalFouls AS FLOAT)) AS AveragePersonalFouls,
    AVG(CAST(MinutesPlayed AS FLOAT)) AS AverageMinutesPlayed,
    
    -- Combined Statistics
    AVG(CAST(TotalPoints + TotalRebounds AS FLOAT)) AS AveragePointsPlusRebounds,
    AVG(CAST(TotalPoints + TotalRebounds + Assists AS FLOAT)) AS AveragePointsPlusReboundsPlusAssists,
    AVG(CAST(TotalPoints + Assists AS FLOAT)) AS AveragePointsPlusAssists,
    AVG(CAST(Assists + TotalRebounds AS FLOAT)) AS AverageAssistsPlusRebounds,
    
    -- Over/Under Statistics
    AVG(CAST(TotalPoints AS FLOAT)) AS AverageOverPoints,
    COUNT(CASE WHEN TotalPoints > 20 THEN 1 END) AS GamesOver20Points,
    COUNT(CASE WHEN TotalPoints > 25 THEN 1 END) AS GamesOver25Points,
    COUNT(CASE WHEN TotalPoints > 30 THEN 1 END) AS GamesOver30Points,
    COUNT(CASE WHEN TotalPoints > 35 THEN 1 END) AS GamesOver35Points,
    COUNT(CASE WHEN TotalPoints > 40 THEN 1 END) AS GamesOver40Points,
    
    -- Rebound Over/Under
    COUNT(CASE WHEN TotalRebounds > 5 THEN 1 END) AS GamesOver5Rebounds,
    COUNT(CASE WHEN TotalRebounds > 10 THEN 1 END) AS GamesOver10Rebounds,
    COUNT(CASE WHEN TotalRebounds > 15 THEN 1 END) AS GamesOver15Rebounds,
    
    -- Assist Over/Under
    COUNT(CASE WHEN Assists > 5 THEN 1 END) AS GamesOver5Assists,
    COUNT(CASE WHEN Assists > 10 THEN 1 END) AS GamesOver10Assists,
    COUNT(CASE WHEN Assists > 15 THEN 1 END) AS GamesOver15Assists,
    
    -- Shooting Statistics
    AVG(CAST(FieldGoalsMade AS FLOAT)) AS AverageFieldGoalsMade,
    AVG(CAST(FieldGoalsAttempted AS FLOAT)) AS AverageFieldGoalsAttempted,
    AVG(CAST(ThreePointShotsMade AS FLOAT)) AS AverageThreePointShotsMade,
    AVG(CAST(ThreePointShotsAttempted AS FLOAT)) AS AverageThreePointShotsAttempted,
    AVG(CAST(FreeThrowsMade AS FLOAT)) AS AverageFreeThrowsMade,
    AVG(CAST(FreeThrowsAttempted AS FLOAT)) AS AverageFreeThrowsAttempted,
    
    -- Shooting Percentages
    CASE 
        WHEN AVG(CAST(FieldGoalsAttempted AS FLOAT)) > 0 
        THEN (AVG(CAST(FieldGoalsMade AS FLOAT)) / AVG(CAST(FieldGoalsAttempted AS FLOAT))) * 100
        ELSE 0
    END AS FieldGoalPercentage,
    
    CASE 
        WHEN AVG(CAST(ThreePointShotsAttempted AS FLOAT)) > 0 
        THEN (AVG(CAST(ThreePointShotsMade AS FLOAT)) / AVG(CAST(ThreePointShotsAttempted AS FLOAT))) * 100
        ELSE 0
    END AS ThreePointPercentage,
    
    CASE 
        WHEN AVG(CAST(FreeThrowsAttempted AS FLOAT)) > 0 
        THEN (AVG(CAST(FreeThrowsMade AS FLOAT)) / AVG(CAST(FreeThrowsAttempted AS FLOAT))) * 100
        ELSE 0
    END AS FreeThrowPercentage,
    
    -- Min/Max Statistics
    MAX(TotalPoints) AS MaxPoints,
    MIN(TotalPoints) AS MinPoints,
    MAX(TotalRebounds) AS MaxRebounds,
    MIN(TotalRebounds) AS MinRebounds,
    MAX(Assists) AS MaxAssists,
    MIN(Assists) AS MinAssists,
    MAX(MinutesPlayed) AS MaxMinutesPlayed,
    MIN(MinutesPlayed) AS MinMinutesPlayed,
    
    -- Game Information
    COUNT(*) AS GamesPlayed,
    COUNT(CASE WHEN GameLocation = 'Home' THEN 1 END) AS HomeGames,
    COUNT(CASE WHEN GameLocation = 'Away' THEN 1 END) AS AwayGames,
    
    -- Recent Performance (last 5 games)
    AVG(CAST(TotalPoints AS FLOAT)) AS RecentAveragePoints,
    AVG(CAST(TotalRebounds AS FLOAT)) AS RecentAverageRebounds,
    AVG(CAST(Assists AS FLOAT)) AS RecentAverageAssists,
    
    -- Consistency Metrics
    STDEV(CAST(TotalPoints AS FLOAT)) AS PointsStandardDeviation,
    STDEV(CAST(TotalRebounds AS FLOAT)) AS ReboundsStandardDeviation,
    STDEV(CAST(Assists AS FLOAT)) AS AssistsStandardDeviation,
    
    GETDATE() AS LastUpdated
FROM PlayerStatsInMatchups
GROUP BY 
    PlayerId,
    FirstName,
    LastName,
    Position,
    GameId,
    TeamId,
    TeamHomeId,
    TeamVisitorId,
    HomeTeamName,
    HomeTeamNickName,
    VisitorTeamName,
    VisitorTeamNickName,
    EnemyTeamId,
    EnemyTeamName,
    EnemyTeamNickName,
    SeasonId,
    SeasonYear;

-- =====================================================
-- 7. TEAM VS TEAM POSITION COMPARATIVE STATISTICS VIEW
-- =====================================================
-- Drop the view if it exists
IF EXISTS (SELECT * FROM sys.views WHERE name = 'TeamVsTeamPositionStats')
    DROP VIEW TeamVsTeamPositionStats;

-- Create the view
CREATE VIEW TeamVsTeamPositionStats AS
WITH PlayerStatsWithMinutes AS (
    -- Convert MinutesPlayed to numeric minutes
    SELECT 
        PS.*,
        G.TeamHomeId,
        G.TeamVisitorId,
        CASE 
            WHEN PS.MinutesPlayed IS NULL THEN 0
            WHEN PS.MinutesPlayed LIKE '%:%' THEN 
                CAST(LEFT(PS.MinutesPlayed, CHARINDEX(':', PS.MinutesPlayed) - 1) AS FLOAT) + 
                (CAST(SUBSTRING(PS.MinutesPlayed, CHARINDEX(':', PS.MinutesPlayed) + 1, 2) AS FLOAT) / 60.0)
            ELSE TRY_CAST(PS.MinutesPlayed AS FLOAT)
        END AS MinutesPlayedNumeric
    FROM PlayerStats PS
    INNER JOIN Game G ON PS.GameId = G.Id
    WHERE PS.Active = 1 
      AND G.Active = 1
      AND PS.Position IS NOT NULL
),
Team1VsTeam2 AS (
    -- Team 1 vs Team 2: Statistics for Team 1's players against Team 2
    SELECT 
        G.Id AS GameId,
        PS.TeamId AS TeamובדId,
        CASE WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId ELSE G.TeamHomeId END AS OpponentTeamId,
        PS.Position,
        PS.MinutesPlayedNumeric >= 20 AS PlayedMoreThan20Min,
        PS.TotalPoints,
        PS.TotalRebounds,
        PS.Turnovers,
        PS.PersonalFouls,
        PS.Blocks
    FROM PlayerStatsWithMinutes PS
    INNER JOIN Game G ON PS.GameId = G.Id
    WHERE (G.TeamHomeId IN (PS.TeamId, CASE WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId ELSE G.TeamHomeId END)
           AND G.TeamVisitorId IN (PS.TeamId, CASE WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId ELSE G.TeamHomeId END))
),
Team1VsAll AS (
    -- Team 1 vs All: Statistics for Team 1's players against all opponents
    SELECT 
        G.Id AS GameId,
        PS.TeamId AS TeamId,
        CASE WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId ELSE G.TeamHomeId END AS OpponentTeamId,
        PS.Position,
        PS.MinutesPlayedNumeric >= 20 AS PlayedMoreThan20Min,
        PS.TotalPoints,
        PS.TotalRebounds,
        PS.Turnovers,
        PS.PersonalFouls,
        PS.Blocks
    FROM PlayerStatsWithMinutes PS
    INNER JOIN Game G ON PS.GameId = G.Id
),
OpponentStatsByPosition AS (
    -- Get opponent player stats by position for calculating points conceded
    SELECT 
        G.Id AS GameId,
        PS.TeamId AS TeamId,
        CASE WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId ELSE G.TeamHomeId END AS OpponentTeamId,
        OPS.Position AS OpponentPosition,
        OPS.TotalPoints AS OpponentPoints
    FROM PlayerStatsWithMinutes PS
    INNER JOIN Game G ON PS.GameId = G.Id
    INNER JOIN PlayerStats OPS ON OPS.GameId = G.Id 
        AND OPS.TeamId = CASE WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId ELSE G.TeamHomeId END
        AND OPS.Active = 1
    WHERE PS.Active = 1
)
SELECT 
    -- Matchup identification
    1 AS TeamId1,
    2 AS TeamId2,
    'Team1VsTeam2' AS MatchupType,
    
    -- Team information
    T1.Id AS TeamId,
    T1.Name AS TeamName,
    T1.NickName AS TeamNickName,
    T2.Id AS OpponentTeamId,
    T2.Name AS OpponentTeamName,
    T2.NickName AS OpponentTeamNickName,
    
    -- Position grouping
    ISNULL(PS.Position, 'Unknown') AS Position,
    
    -- Points scored by players of this position who played more than 20 minutes
    SUM(CASE WHEN PS.PlayedMoreThan20Min = 1 THEN PS.TotalPoints ELSE 0 END) AS TotalPointsScoredOver20Min,
    
    -- Average points conceded by team against players of this position
    ISNULL(AVG(CAST(OPP.OpponentPoints AS FLOAT)), 0) AS AvgPointsConceded,
    
    -- Aggregated statistics by position
    SUM(PS.TotalRebounds) AS TotalRebounds,
    SUM(PS.Turnovers) AS TotalTurnovers,
    SUM(PS.PersonalFouls) AS TotalFouls,
    SUM(PS.Blocks) AS TotalBlocks,
    
    -- Additional metrics
    COUNT(DISTINCT PS.GameId) AS GamesPlayed,
    AVG(CAST(PS.TotalPoints AS FLOAT)) AS AvgPointsPerGame,
    AVG(CAST(PS.TotalRebounds AS FLOAT)) AS AvgReboundsPerGame,
    AVG(CAST(PS.Turnovers AS FLOAT)) AS AvgTurnoversPerGame,
    AVG(CAST(PS.PersonalFouls AS FLOAT)) AS AvgFoulsPerGame,
    AVG(CAST(PS.Blocks AS FLOAT)) AS AvgBlocksPerGame,
    
    GETDATE() AS LastUpdated
FROM Team1VsTeam2 PS
INNER JOIN Team T1 ON PS.TeamId = T1.Id
INNER JOIN Team T2 ON PS.OpponentTeamId = T2.Id
LEFT JOIN OpponentStatsByPosition OPP ON OPP.GameId = PS.GameId 
    AND OSP.TeamId = PS.TeamId 
    AND OSP.OpponentPosition = PS.Position
WHERE T1.Active = 1 AND T2.Active = 1
GROUP BY 
    T1.Id, T1.Name, T1.NickName,
    T2.Id, T2.Name, T2.NickName,
    PS.Position

UNION ALL

-- Team 2 vs Team 1: Statistics for Team 2's players against Team 1
SELECT 
    1 AS TeamId1,
    2 AS TeamId2,
    'Team2VsTeam1' AS MatchupType,
    
    T2.Id AS TeamId,
    T2.Name AS TeamName,
    T2.NickName AS TeamNickName,
    T1.Id AS OpponentTeamId,
    T1.Name AS OpponentTeamName,
    T1.NickName AS OpponentTeamNickName,
    
    ISNULL(PS.Position, 'Unknown') AS Position,
    
    SUM(CASE WHEN PS.PlayedMoreThan20Min = 1 THEN PS.TotalPoints ELSE 0 END) AS TotalPointsScoredOver20Min,
    ISNULL(AVG(CAST(OPP.OpponentPoints AS FLOAT)), 0) AS AvgPointsConceded,
    
    SUM(PS.TotalRebounds) AS TotalRebounds,
    SUM(PS.Turnovers) AS TotalTurnovers,
    SUM(PS.PersonalFouls) AS TotalFouls,
    SUM(PS.Blocks) AS TotalBlocks,
    
    COUNT(DISTINCT PS.GameId) AS GamesPlayed,
    AVG(CAST(PS.TotalPoints AS FLOAT)) AS AvgPointsPerGame,
    AVG(CAST(PS.TotalRebounds AS FLOAT)) AS AvgReboundsPerGame,
    AVG(CAST(PS.Turnovers AS FLOAT)) AS AvgTurnoversPerGame,
    AVG(CAST(PS.PersonalFouls AS FLOAT)) AS AvgFoulsPerGame,
    AVG(CAST(PS.Blocks AS FLOAT)) AS AvgBlocksPerGame,
    
    GETDATE() AS LastUpdated
FROM Team1VsTeam2 PS
INNER JOIN Team T1 ON PS.OpponentTeamId = T1.Id
INNER JOIN Team T2 ON PS.TeamId = T2.Id
LEFT JOIN OpponentStatsByPosition OPP ON OPP.GameId = PS.GameId 
    AND OPP.TeamId = PS.OpponentTeamId
    AND OPP.OpponentPosition = PS.Position
WHERE T1.Active = 1 AND T2.Active = 1
  AND PS.TeamId = T2.Id
GROUP BY 
    T2.Id, T2.Name, T2.NickName,
    T1.Id, T1.Name, T1.NickName,
    PS.Position

UNION ALL

-- Team 1 vs All: Statistics for Team 1's players against all opponents
SELECT 
    PS.TeamId AS TeamId1,
    NULL AS TeamId2,
    'Team1VsAll' AS MatchupType,
    
    T1.Id AS TeamId,
    T1.Name AS TeamName,
    T1.NickName AS TeamNickName,
    NULL AS OpponentTeamId,
    'All Opponents' AS OpponentTeamName,
    'All' AS OpponentTeamNickName,
    
    ISNULL(PS.Position, 'Unknown') AS Position,
    
    SUM(CASE WHEN PS.PlayedMoreThan20Min = 1 THEN PS.TotalPoints ELSE 0 END) AS TotalPointsScoredOver20Min,
    ISNULL(AVG(CAST(OPP.OpponentPoints AS FLOAT)), 0) AS AvgPointsConceded,
    
    SUM(PS.TotalRebounds) AS TotalRebounds,
    SUM(PS.Turnovers) AS TotalTurnovers,
    SUM(PS.PersonalFouls) AS TotalFouls,
    SUM(PS.Blocks) AS TotalBlocks,
    
    COUNT(DISTINCT PS.GameId) AS GamesPlayed,
    AVG(CAST(PS.TotalPoints AS FLOAT)) AS AvgPointsPerGame,
    AVG(CAST(PS.TotalRebounds AS FLOAT)) AS AvgReboundsPerGame,
    AVG(CAST(PS.Turnovers AS FLOAT)) AS AvgTurnoversPerGame,
    AVG(CAST(PS.PersonalFouls AS FLOAT)) AS AvgFoulsPerGame,
    AVG(CAST(PS.Blocks AS FLOAT)) AS AvgBlocksPerGame,
    
    GETDATE() AS LastUpdated
FROM Team1VsAll PS
INNER JOIN Team T1 ON PS.TeamId = T1.Id
LEFT JOIN OpponentStatsByPosition OPP ON OPP.GameId = PS.GameId 
    AND OPP.TeamId = PS.TeamId
    AND OPP.OpponentPosition = PS.Position
WHERE T1.Active = 1
GROUP BY 
    PS.TeamId,
    T1.Id, T1.Name, T1.NickName,
    PS.Position

UNION ALL

-- Team 2 vs All: Statistics for Team 2's players against all opponents
SELECT 
    PS.TeamId AS TeamId2,
    NULL AS TeamId1,
    'Team2VsAll' AS MatchupType,
    
    T2.Id AS TeamId,
    T2.Name AS TeamName,
    T2.NickName AS TeamNickName,
    NULL AS OpponentTeamId,
    'All Opponents' AS OpponentTeamName,
    'All' AS OpponentTeamNickName,
    
    ISNULL(PS.Position, 'Unknown') AS Position,
    
    SUM(CASE WHEN PS.PlayedMoreThan20Min = 1 THEN PS.TotalPoints ELSE 0 END) AS TotalPointsScoredOver20Min,
    ISNULL(AVG(CAST(OPP.OpponentPoints AS FLOAT)), 0) AS AvgPointsConceded,
    
    SUM(PS.TotalRebounds) AS TotalRebounds,
    SUM(PS.Turnovers) AS TotalTurnovers,
    SUM(PS.PersonalFouls) AS TotalFouls,
    SUM(PS.Blocks) AS TotalBlocks,
    
    COUNT(DISTINCT PS.GameId) AS GamesPlayed,
    AVG(CAST(PS.TotalPoints AS FLOAT)) AS AvgPointsPerGame,
    AVG(CAST(PS.TotalRebounds AS FLOAT)) AS AvgReboundsPerGame,
    AVG(CAST(PS.Turnovers AS FLOAT)) AS AvgTurnoversPerGame,
    AVG(CAST(PS.PersonalFouls AS FLOAT)) AS AvgFoulsPerGame,
    AVG(CAST(PS.Blocks AS FLOAT)) AS AvgBlocksPerGame,
    
    GETDATE() AS LastUpdated
FROM Team1VsAll PS
INNER JOIN Team T2 ON PS.TeamId = T2.Id
LEFT JOIN OpponentStatsByPosition OPP ON OPP.GameId = PS.GameId 
    AND OPP.TeamId = PS.TeamId
    AND OPP.OpponentPosition = PS.Position
WHERE T2.Active = 1
GROUP BY 
    PS.TeamId,
    T2.Id, T2.Name, T2.NickName,
    PS.Position;

PRINT 'Materialized views created successfully!';
