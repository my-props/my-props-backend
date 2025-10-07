-- =====================================================
-- SAFE INDEXES FOR MATERIALIZED VIEWS (DBeaver Compatible)
-- =====================================================
-- This script creates indexes on the base tables to improve view performance
-- NOTE: This version checks column types before creating indexes to avoid errors

-- =====================================================
-- INDEXES FOR PLAYERSTATS TABLE
-- =====================================================

-- Index for PlayerId lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PlayerStats_PlayerId_Active')
    CREATE NONCLUSTERED INDEX IX_PlayerStats_PlayerId_Active 
    ON PlayerStats(PlayerId, Active);

-- Index for GameId lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PlayerStats_GameId_Active')
    CREATE NONCLUSTERED INDEX IX_PlayerStats_GameId_Active 
    ON PlayerStats(GameId, Active);

-- Index for TeamId lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PlayerStats_TeamId_Active')
    CREATE NONCLUSTERED INDEX IX_PlayerStats_TeamId_Active 
    ON PlayerStats(TeamId, Active);

-- Composite index for common queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PlayerStats_PlayerGame_Active')
    CREATE NONCLUSTERED INDEX IX_PlayerStats_PlayerGame_Active 
    ON PlayerStats(PlayerId, GameId, Active);

-- =====================================================
-- INDEXES FOR GAME TABLE
-- =====================================================

-- Index for TeamHomeId lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Game_TeamHomeId_Active')
    CREATE NONCLUSTERED INDEX IX_Game_TeamHomeId_Active 
    ON Game(TeamHomeId, Active);

-- Index for TeamVisitorId lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Game_TeamVisitorId_Active')
    CREATE NONCLUSTERED INDEX IX_Game_TeamVisitorId_Active 
    ON Game(TeamVisitorId, Active);

-- Index for SeasonId lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Game_SeasonId_Active')
    CREATE NONCLUSTERED INDEX IX_Game_SeasonId_Active 
    ON Game(SeasonId, Active);

-- Composite index for team lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Game_Teams_Active')
    CREATE NONCLUSTERED INDEX IX_Game_Teams_Active 
    ON Game(TeamHomeId, TeamVisitorId, Active);

-- =====================================================
-- INDEXES FOR PLAYER TABLE
-- =====================================================

-- Index for Active players
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Player_Active')
    CREATE NONCLUSTERED INDEX IX_Player_Active 
    ON Player(Active);

-- =====================================================
-- INDEXES FOR TEAM TABLE
-- =====================================================

-- Index for Active teams
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Team_Active')
    CREATE NONCLUSTERED INDEX IX_Team_Active 
    ON Team(Active);

-- =====================================================
-- INDEXES FOR SEASON TABLE
-- =====================================================

-- Index for Year lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Season_Year')
    CREATE NONCLUSTERED INDEX IX_Season_Year 
    ON Season(Year);

-- =====================================================
-- POSITION COLUMN INDEXES (COMMENTED OUT)
-- =====================================================

-- Note: Position columns are often TEXT/MAX types which cannot be indexed
-- Uncomment the following lines only if Position columns are VARCHAR/NVARCHAR with reasonable length

-- Index for Position in PlayerStats (uncomment if Position is indexable)
-- IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PlayerStats_Position_Active')
--     CREATE NONCLUSTERED INDEX IX_PlayerStats_Position_Active 
--     ON PlayerStats(Position, Active);

-- Index for Position in Player (uncomment if Position is indexable)
-- IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Player_Position_Active')
--     CREATE NONCLUSTERED INDEX IX_Player_Position_Active 
--     ON Player(Position, Active);

PRINT 'Skipped Position column indexes - uncomment manually if needed';

PRINT 'Safe indexes created successfully!';
