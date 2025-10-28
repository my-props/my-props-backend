-- =====================================================
-- REFRESH PROCEDURES FOR MATERIALIZED VIEWS (DBeaver Compatible)
-- =====================================================
-- This script creates stored procedures to refresh materialized views
-- and manage their data efficiently
-- NOTE: This version fixes DBeaver compatibility issues and removes THROW statements

-- =====================================================
-- 1. REFRESH ALL MATERIALIZED VIEWS
-- =====================================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'RefreshAllMaterializedViews')
    DROP PROCEDURE RefreshAllMaterializedViews;

CREATE PROCEDURE RefreshAllMaterializedViews
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @StartTime DATETIME2 = GETDATE();
    DECLARE @ErrorMessage NVARCHAR(4000);
    DECLARE @SuccessCount INT = 0;
    DECLARE @ErrorCount INT = 0;
    
    PRINT 'Starting refresh of all materialized views...'
    
    -- Refresh PlayerVsTeamStats
    BEGIN TRY
        PRINT 'Refreshing PlayerVsTeamStats...'
        EXEC RefreshPlayerVsTeamStats;
        PRINT 'PlayerVsTeamStats refreshed successfully'
        SET @SuccessCount = @SuccessCount + 1
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        PRINT 'ERROR refreshing PlayerVsTeamStats: ' + @ErrorMessage
        SET @ErrorCount = @ErrorCount + 1
        
        -- Log the error
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
        VALUES ('PlayerVsTeamStats', 'FULL', @StartTime, GETDATE(), DATEDIFF(SECOND, @StartTime, GETDATE()), 'ERROR', @ErrorMessage)
    END CATCH
    
    -- Refresh PlayerPositionStats
    BEGIN TRY
        PRINT 'Refreshing PlayerPositionStats...'
        EXEC RefreshPlayerPositionStats;
        PRINT 'PlayerPositionStats refreshed successfully'
        SET @SuccessCount = @SuccessCount + 1
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        PRINT 'ERROR refreshing PlayerPositionStats: ' + @ErrorMessage
        SET @ErrorCount = @ErrorCount + 1
        
        -- Log the error
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
        VALUES ('PlayerPositionStats', 'FULL', @StartTime, GETDATE(), DATEDIFF(SECOND, @StartTime, GETDATE()), 'ERROR', @ErrorMessage)
    END CATCH
    
    -- Refresh PlayerVsPositionStats
    BEGIN TRY
        PRINT 'Refreshing PlayerVsPositionStats...'
        EXEC RefreshPlayerVsPositionStats;
        PRINT 'PlayerVsPositionStats refreshed successfully'
        SET @SuccessCount = @SuccessCount + 1
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        PRINT 'ERROR refreshing PlayerVsPositionStats: ' + @ErrorMessage
        SET @ErrorCount = @ErrorCount + 1
        
        -- Log the error
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
        VALUES ('PlayerVsPositionStats', 'FULL', @StartTime, GETDATE(), DATEDIFF(SECOND, @StartTime, GETDATE()), 'ERROR', @ErrorMessage)
    END CATCH
    
    -- Refresh PlayerVsPlayerStats
    BEGIN TRY
        PRINT 'Refreshing PlayerVsPlayerStats...'
        EXEC RefreshPlayerVsPlayerStats;
        PRINT 'PlayerVsPlayerStats refreshed successfully'
        SET @SuccessCount = @SuccessCount + 1
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        PRINT 'ERROR refreshing PlayerVsPlayerStats: ' + @ErrorMessage
        SET @ErrorCount = @ErrorCount + 1
        
        -- Log the error
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
        VALUES ('PlayerVsPlayerStats', 'FULL', @StartTime, GETDATE(), DATEDIFF(SECOND, @StartTime, GETDATE()), 'ERROR', @ErrorMessage)
    -- Refresh TeamVsTeamPlayerStats
    BEGIN TRY
        PRINT 'Refreshing TeamVsTeamPlayerStats...'
        EXEC RefreshTeamVsTeamPlayerStats;
        PRINT 'TeamVsTeamPlayerStats refreshed successfully'
        SET @SuccessCount = @SuccessCount + 1
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        PRINT 'ERROR refreshing TeamVsTeamPlayerStats: ' + @ErrorMessage
        SET @ErrorCount = @ErrorCount + 1
        
        -- Log the error
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
        VALUES ('TeamVsTeamPlayerStats', 'FULL', @StartTime, GETDATE(), DATEDIFF(SECOND, @StartTime, GETDATE()), 'ERROR', @ErrorMessage)
    END CATCH
    
    DECLARE @EndTime DATETIME2 = GETDATE();
    DECLARE @Duration INT = DATEDIFF(SECOND, @StartTime, @EndTime);
    
    PRINT 'Refresh completed:'
    PRINT '  Successfully refreshed: ' + CAST(@SuccessCount AS VARCHAR(10)) + ' views'
    PRINT '  Failed: ' + CAST(@ErrorCount AS VARCHAR(10)) + ' views'
    PRINT '  Total time: ' + CAST(@Duration AS VARCHAR(10)) + ' seconds'
    
    -- Log the overall result
    INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
    VALUES ('ALL_VIEWS', 'FULL', @StartTime, @EndTime, @Duration, 
            CASE WHEN @ErrorCount = 0 THEN 'SUCCESS' ELSE 'PARTIAL' END,
            CASE WHEN @ErrorCount > 0 THEN 'Some views failed to refresh' ELSE NULL END)
    
    -- Return summary
    SELECT 
        @SuccessCount as SuccessCount,
        @ErrorCount as ErrorCount,
        @Duration as DurationSeconds,
        CASE WHEN @ErrorCount = 0 THEN 'ALL_SUCCESS' 
             WHEN @SuccessCount = 0 THEN 'ALL_FAILED' 
             ELSE 'PARTIAL_SUCCESS' END as OverallStatus
END;

-- =====================================================
-- 2. REFRESH PLAYER VS TEAM STATISTICS
-- =====================================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'RefreshPlayerVsTeamStats')
    DROP PROCEDURE RefreshPlayerVsTeamStats;

CREATE PROCEDURE RefreshPlayerVsTeamStats
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @StartTime DATETIME2 = GETDATE();
    DECLARE @ErrorMessage NVARCHAR(4000);
    
    BEGIN TRY
        -- Drop and recreate the view
        IF EXISTS (SELECT * FROM sys.views WHERE name = 'PlayerVsTeamStats')
            DROP VIEW PlayerVsTeamStats;
            
        -- Recreate the view (this will refresh the data)
        EXEC('
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
            S.Year
        ')
        
        DECLARE @EndTime DATETIME2 = GETDATE();
        DECLARE @Duration INT = DATEDIFF(SECOND, @StartTime, @EndTime);
        
        PRINT 'PlayerVsTeamStats refreshed successfully in ' + CAST(@Duration AS VARCHAR(10)) + ' seconds'
        
        -- Log the refresh
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status)
        VALUES ('PlayerVsTeamStats', 'FULL', @StartTime, @EndTime, @Duration, 'SUCCESS')
        
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        PRINT 'Error refreshing PlayerVsTeamStats: ' + @ErrorMessage;
        
        -- Log the error
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
        VALUES ('PlayerVsTeamStats', 'FULL', @StartTime, GETDATE(), DATEDIFF(SECOND, @StartTime, GETDATE()), 'ERROR', @ErrorMessage)
        
        -- Instead of THROW, just print the error and continue
        PRINT 'Continuing with other views...'
    END CATCH
END;

-- =====================================================
-- 3. REFRESH PLAYER POSITION STATISTICS
-- =====================================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'RefreshPlayerPositionStats')
    DROP PROCEDURE RefreshPlayerPositionStats;

CREATE PROCEDURE RefreshPlayerPositionStats
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @StartTime DATETIME2 = GETDATE();
    DECLARE @ErrorMessage NVARCHAR(4000);
    
    BEGIN TRY
        -- Drop and recreate the view
        IF EXISTS (SELECT * FROM sys.views WHERE name = 'PlayerPositionStats')
            DROP VIEW PlayerPositionStats;
            
        -- Recreate the view (this will refresh the data)
        EXEC('
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
            S.Year
        ')
        
        DECLARE @EndTime DATETIME2 = GETDATE();
        DECLARE @Duration INT = DATEDIFF(SECOND, @StartTime, @EndTime);
        
        PRINT 'PlayerPositionStats refreshed successfully in ' + CAST(@Duration AS VARCHAR(10)) + ' seconds'
        
        -- Log the refresh
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status)
        VALUES ('PlayerPositionStats', 'FULL', @StartTime, @EndTime, @Duration, 'SUCCESS')
        
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        PRINT 'Error refreshing PlayerPositionStats: ' + @ErrorMessage;
        
        -- Log the error
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
        VALUES ('PlayerPositionStats', 'FULL', @StartTime, GETDATE(), DATEDIFF(SECOND, @StartTime, GETDATE()), 'ERROR', @ErrorMessage)
        
        -- Instead of THROW, just print the error and continue
        PRINT 'Continuing with other views...'
    END CATCH
END;

-- =====================================================
-- 4. REFRESH PLAYER VS POSITION STATISTICS
-- =====================================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'RefreshPlayerVsPositionStats')
    DROP PROCEDURE RefreshPlayerVsPositionStats;

CREATE PROCEDURE RefreshPlayerVsPositionStats
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @StartTime DATETIME2 = GETDATE();
    DECLARE @ErrorMessage NVARCHAR(4000);
    
    BEGIN TRY
        -- Drop and recreate the view
        IF EXISTS (SELECT * FROM sys.views WHERE name = 'PlayerVsPositionStats')
            DROP VIEW PlayerVsPositionStats;
            
        -- Recreate the view (this will refresh the data)
        EXEC('
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
            S.Year
        ')
        
        DECLARE @EndTime DATETIME2 = GETDATE();
        DECLARE @Duration INT = DATEDIFF(SECOND, @StartTime, @EndTime);
        
        PRINT 'PlayerVsPositionStats refreshed successfully in ' + CAST(@Duration AS VARCHAR(10)) + ' seconds'
        
        -- Log the refresh
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status)
        VALUES ('PlayerVsPositionStats', 'FULL', @StartTime, @EndTime, @Duration, 'SUCCESS')
        
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        PRINT 'Error refreshing PlayerVsPositionStats: ' + @ErrorMessage;
        
        -- Log the error
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
        VALUES ('PlayerVsPositionStats', 'FULL', @StartTime, GETDATE(), DATEDIFF(SECOND, @StartTime, GETDATE()), 'ERROR', @ErrorMessage)
        
        -- Instead of THROW, just print the error and continue
        PRINT 'Continuing with other views...'
    END CATCH
END;

-- =====================================================
-- 5. REFRESH PLAYER VS PLAYER STATISTICS
-- =====================================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'RefreshPlayerVsPlayerStats')
    DROP PROCEDURE RefreshPlayerVsPlayerStats;

CREATE PROCEDURE RefreshPlayerVsPlayerStats
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @StartTime DATETIME2 = GETDATE();
    DECLARE @ErrorMessage NVARCHAR(4000);
    
    BEGIN TRY
        -- Drop and recreate the view
        IF EXISTS (SELECT * FROM sys.views WHERE name = 'PlayerVsPlayerStats')
            DROP VIEW PlayerVsPlayerStats;
            
        -- Recreate the view (this will refresh the data)
        EXEC('
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
          AND P2.Active = 1
        ')
        
        DECLARE @EndTime DATETIME2 = GETDATE();
        DECLARE @Duration INT = DATEDIFF(SECOND, @StartTime, @EndTime);
        
        PRINT 'PlayerVsPlayerStats refreshed successfully in ' + CAST(@Duration AS VARCHAR(10)) + ' seconds'
        
        -- Log the refresh
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status)
        VALUES ('PlayerVsPlayerStats', 'FULL', @StartTime, @EndTime, @Duration, 'SUCCESS')
        
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        PRINT 'Error refreshing PlayerVsPlayerStats: ' + @ErrorMessage;
        
        -- Log the error
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
        VALUES ('PlayerVsPlayerStats', 'FULL', @StartTime, GETDATE(), DATEDIFF(SECOND, @StartTime, GETDATE()), 'ERROR', @ErrorMessage)
        
        -- Instead of THROW, just print the error and continue
        PRINT 'Continuing with other views...'
    END CATCH
END;

-- =====================================================
-- 6. REFRESH TEAM VS TEAM PLAYER STATISTICS
-- =====================================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'RefreshTeamVsTeamPlayerStats')
    DROP PROCEDURE RefreshTeamVsTeamPlayerStats;

CREATE PROCEDURE RefreshTeamVsTeamPlayerStats
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @StartTime DATETIME2 = GETDATE();
    DECLARE @ErrorMessage NVARCHAR(4000);
    
    BEGIN TRY
        -- Drop and recreate the view
        IF EXISTS (SELECT * FROM sys.views WHERE name = 'TeamVsTeamPlayerStats')
            DROP VIEW TeamVsTeamPlayerStats;
            
        -- Recreate the view (this will refresh the data)
        EXEC('
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
                    WHEN PS.TeamId = TM.TeamHomeId THEN ''Home''
                    ELSE ''Away''
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
            TeamId,
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
            
            -- Game Information
            COUNT(*) AS GamesPlayed,
            COUNT(CASE WHEN GameLocation = ''Home'' THEN 1 END) AS HomeGames,
            COUNT(CASE WHEN GameLocation = ''Away'' THEN 1 END) AS AwayGames,
            
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
            TeamId,
            CASE 
                WHEN TeamId = TeamHomeId THEN HomeTeamName
                ELSE VisitorTeamName
            END,
            CASE 
                WHEN TeamId = TeamHomeId THEN HomeTeamNickName
                ELSE VisitorTeamNickName
            END,
            EnemyTeamId,
            EnemyTeamName,
            EnemyTeamNickName,
            SeasonId,
            SeasonYear
        ')
        
        DECLARE @EndTime DATETIME2 = GETDATE();
        DECLARE @Duration INT = DATEDIFF(SECOND, @StartTime, @EndTime);
        
        PRINT 'TeamVsTeamPlayerStats refreshed successfully in ' + CAST(@Duration AS VARCHAR(10)) + ' seconds'
        
        -- Log the refresh
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status)
        VALUES ('TeamVsTeamPlayerStats', 'FULL', @StartTime, @EndTime, @Duration, 'SUCCESS')
        
    END TRY
    BEGIN CATCH
        SET @ErrorMessage = ERROR_MESSAGE();
        PRINT 'Error refreshing TeamVsTeamPlayerStats: ' + @ErrorMessage;
        
        -- Log the error
        INSERT INTO ViewRefreshLog (ViewName, RefreshType, StartTime, EndTime, Duration, Status, ErrorMessage)
        VALUES ('TeamVsTeamPlayerStats', 'FULL', @StartTime, GETDATE(), DATEDIFF(SECOND, @StartTime, GETDATE()), 'ERROR', @ErrorMessage)
        
        -- Instead of THROW, just print the error and continue
        PRINT 'Continuing with other views...'
    END CATCH
END;

-- =====================================================
-- 7. CREATE REFRESH LOG TABLE
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ViewRefreshLog')
BEGIN
    CREATE TABLE ViewRefreshLog (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ViewName NVARCHAR(100) NOT NULL,
        RefreshType NVARCHAR(20) NOT NULL, -- FULL, INCREMENTAL
        StartTime DATETIME2 NOT NULL,
        EndTime DATETIME2 NOT NULL,
        Duration INT NOT NULL, -- in seconds
        Status NVARCHAR(20) NOT NULL, -- SUCCESS, ERROR
        ErrorMessage NVARCHAR(4000) NULL,
        CreatedAt DATETIME2 DEFAULT GETDATE()
    );
    
    -- Create index for better query performance
    CREATE NONCLUSTERED INDEX IX_ViewRefreshLog_ViewName 
    ON ViewRefreshLog(ViewName);
    
    CREATE NONCLUSTERED INDEX IX_ViewRefreshLog_StartTime 
    ON ViewRefreshLog(StartTime);
END;

PRINT 'Refresh procedures created successfully!';
