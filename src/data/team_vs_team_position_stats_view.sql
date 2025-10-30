-- =====================================================
-- TEAM VS TEAM POSITION COMPARATIVE STATISTICS VIEW
-- =====================================================
-- This view provides comparative statistics between two basketball teams
-- and their players, grouped by player position.
--
-- Usage:
-- SELECT * FROM TeamVsTeamPositionStats 
-- WHERE (TeamId1 = @teamId1 AND TeamId2 = @teamId2) 
--    OR (TeamId1 = @teamId2 AND TeamId2 = @teamId1)
--    OR (TeamId1 = @teamId1 AND TeamId2 IS NULL)
--    OR (TeamId1 = @teamId2 AND TeamId2 IS NULL)
--
-- The view returns 4 matchup types:
--   - Team1VsTeam2: Team1 players vs Team2
--   - Team2VsTeam1: Team2 players vs Team1  
--   - Team1VsAll: Team1 players vs all opponents
--   - Team2VsAll: Team2 players vs all opponents

USE [MyProps]
GO

-- Drop the view if it exists
IF EXISTS (SELECT * FROM sys.views WHERE name = 'TeamVsTeamPositionStats')
    DROP VIEW TeamVsTeamPositionStats;
GO

-- Create the view
CREATE VIEW TeamVsTeamPositionStats AS
WITH PlayerStatsWithMinutes AS (
    -- Convert MinutesPlayed to numeric minutes (handles MM:SS format)
    SELECT 
        PS.Id,
        PS.PlayerId,
        PS.TeamId,
        PS.GameId,
        PS.Position,
        PS.TotalPoints,
        PS.TotalRebounds,
        PS.Turnovers,
        PS.PersonalFouls,
        PS.Blocks,
        G.TeamHomeId,
        G.TeamVisitorId,
        CASE 
            WHEN PS.MinutesPlayed IS NULL THEN 0
            WHEN PS.MinutesPlayed LIKE '%:%' THEN 
                CAST(LEFT(PS.MinutesPlayed, CHARINDEX(':', PS.MinutesPlayed) - 1) AS FLOAT) + 
                (CAST(SUBSTRING(PS.MinutesPlayed, CHARINDEX(':', PS.MinutesPlayed) + 1, 2) AS FLOAT) / 60.0)
            ELSE ISNULL(TRY_CAST(PS.MinutesPlayed AS FLOAT), 0)
        END AS MinutesPlayedNumeric
    FROM PlayerStats PS
    INNER JOIN Game G ON PS.GameId = G.Id
    WHERE PS.Active = 1 
      AND G.Active = 1
      AND PS.Position IS NOT NULL
),
OpponentPointsByPosition AS (
    -- Calculate points scored by opponent players by position (for points conceded)
    SELECT 
        G.Id AS GameId,
        PS.TeamId,
        OPS.Position AS OpponentPosition,
        OPS.TotalPoints AS OpponentPoints
    FROM PlayerStats PS
    INNER JOIN Game G ON PS.GameId = G.Id
    INNER JOIN PlayerStats OPS ON OPS.GameId = G.Id 
        AND OPS.TeamId = CASE WHEN PS.TeamId = G.TeamHomeId THEN G.TeamVisitorId ELSE G.TeamHomeId END
        AND OPS.Active = 1
    WHERE PS.Active = 1 
      AND G.Active = 1
      AND OPS.Position IS NOT NULL
),
AllTeamMatchups AS (
    -- All player stats with opponent identification
    SELECT 
        PS.GameId,
        PS.TeamId,
        CASE WHEN PS.TeamId = PS.TeamHomeId THEN PS.TeamVisitorId ELSE PS.TeamHomeId END AS OpponentTeamId,
        PS.Position,
        CASE WHEN PS.MinutesPlayedNumeric >= 20 THEN 1 ELSE 0 END AS PlayedMoreThan20Min,
        PS.TotalPoints,
        PS.TotalRebounds,
        PS.Turnovers,
        PS.PersonalFouls,
        PS.Blocks
    FROM PlayerStatsWithMinutes PS
)
-- Team 1 vs Team 2: Statistics for Team 1's players against Team 2
SELECT 
    -- Matchup identification (normalize: smaller team ID first)
    CASE WHEN PS.TeamId < PS.OpponentTeamId THEN PS.TeamId ELSE PS.OpponentTeamId END AS TeamId1,
    CASE WHEN PS.TeamId < PS.OpponentTeamId THEN PS.OpponentTeamId ELSE PS.TeamId END AS TeamId2,
    'Team1VsTeam2' AS MatchupType,
    
    -- Team information
    PS.TeamId AS TeamId,
    T1.Name AS TeamName,
    T1.NickName AS TeamNickName,
    T1.TeamLogoUrl AS TeamLogoUrl,
    PS.OpponentTeamId AS OpponentTeamId,
    T2.Name AS OpponentTeamName,
    T2.NickName AS OpponentTeamNickName,
    T2.TeamLogoUrl AS OpponentTeamLogoUrl,
    
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
FROM AllTeamMatchups PS
INNER JOIN Team T1 ON PS.TeamId = T1.Id
INNER JOIN Team T2 ON PS.OpponentTeamId = T2.Id
LEFT JOIN OpponentPointsByPosition OPP ON OPP.GameId = PS.GameId 
    AND OPP.TeamId = PS.TeamId 
    AND OPP.OpponentPosition = PS.Position
WHERE T1.Active = 1 AND T2.Active = 1
GROUP BY 
    PS.TeamId,
    PS.OpponentTeamId,
    T1.Id, T1.Name, T1.NickName, T1.TeamLogoUrl,
    T2.Id, T2.Name, T2.NickName, T2.TeamLogoUrl,
    PS.Position

UNION ALL

-- Team 2 vs Team 1: Statistics for Team 2's players against Team 1
SELECT 
    CASE WHEN PS.OpponentTeamId < PS.TeamId THEN PS.OpponentTeamId ELSE PS.TeamId END AS TeamId1,
    CASE WHEN PS.OpponentTeamId < PS.TeamId THEN PS.TeamId ELSE PS.OpponentTeamId END AS TeamId2,
    'Team2VsTeam1' AS MatchupType,
    
    PS.OpponentTeamId AS TeamId,
    T2.Name AS TeamName,
    T2.NickName AS TeamNickName,
    T2.TeamLogoUrl AS TeamLogoUrl,
    PS.TeamId AS OpponentTeamId,
    T1.Name AS OpponentTeamName,
    T1.NickName AS OpponentTeamNickName,
    T1.TeamLogoUrl AS OpponentTeamLogoUrl,
    
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
FROM AllTeamMatchups PS
INNER JOIN Team T1 ON PS.TeamId = T1.Id
INNER JOIN Team T2 ON PS.OpponentTeamId = T2.Id
LEFT JOIN OpponentPointsByPosition OPP ON OPP.GameId = PS.GameId 
    AND OPP.TeamId = PS.OpponentTeamId
    AND OPP.OpponentPosition = PS.Position
WHERE T1.Active = 1 AND T2.Active = 1
GROUP BY 
    PS.TeamId,
    PS.OpponentTeamId,
    T2.Id, T2.Name, T2.NickName, T2.TeamLogoUrl,
    T1.Id, T1.Name, T1.NickName, T1.TeamLogoUrl,
    PS.Position

UNION ALL

-- Team 1 vs All: Statistics for Team 1's players against all opponents
SELECT 
    PS.TeamId AS TeamId1,
    NULL AS TeamId2,
    'Team1VsAll' AS MatchupType,
    
    PS.TeamId AS TeamId,
    T1.Name AS TeamName,
    T1.NickName AS TeamNickName,
    T1.TeamLogoUrl AS TeamLogoUrl,
    NULL AS OpponentTeamId,
    'All Opponents' AS OpponentTeamName,
    'All' AS OpponentTeamNickName,
    NULL AS OpponentTeamLogoUrl,
    
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
FROM AllTeamMatchups PS
INNER JOIN Team T1 ON PS.TeamId = T1.Id
LEFT JOIN OpponentPointsByPosition OPP ON OPP.GameId = PS.GameId 
    AND OPP.TeamId = PS.TeamId
    AND OPP.OpponentPosition = PS.Position
WHERE T1.Active = 1
GROUP BY 
    PS.TeamId,
    T1.Id, T1.Name, T1.NickName, T1.TeamLogoUrl,
    PS.Position

UNION ALL

-- Team 2 vs All: Statistics for Team 2's players against all opponents
SELECT 
    PS.TeamId AS TeamId1,
    NULL AS TeamId2,
    'Team2VsAll' AS MatchupType,
    
    PS.TeamId AS TeamId,
    T2.Name AS TeamName,
    T2.NickName AS TeamNickName,
    T2.TeamLogoUrl AS TeamLogoUrl,
    NULL AS OpponentTeamId,
    'All Opponents' AS OpponentTeamName,
    'All' AS OpponentTeamNickName,
    NULL AS OpponentTeamLogoUrl,
    
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
FROM AllTeamMatchups PS
INNER JOIN Team T2 ON PS.TeamId = T2.Id
LEFT JOIN OpponentPointsByPosition OPP ON OPP.GameId = PS.GameId 
    AND OPP.TeamId = PS.TeamId
    AND OPP.OpponentPosition = PS.Position
WHERE T2.Active = 1
GROUP BY 
    PS.TeamId,
    T2.Id, T2.Name, T2.NickName, T2.TeamLogoUrl,
    PS.Position;
GO

PRINT 'TeamVsTeamPositionStats view created successfully!';
PRINT 'Usage: SELECT * FROM TeamVsTeamPositionStats WHERE (TeamId1 = @teamId1 AND TeamId2 = @teamId2)';

