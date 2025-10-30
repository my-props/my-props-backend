-- =====================================================
-- ADD TEAM LOGO URL AND CONFERENCE COLUMNS
-- =====================================================
-- This script adds TeamLogoUrl and Conference columns to the Team table
-- and populates them with team logos and conference assignments based on team IDs

USE [MyProps]
GO

-- =====================================================
-- 1. ADD COLUMNS TO TEAM TABLE
-- =====================================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Team]') AND name = 'TeamLogoUrl')
BEGIN
    ALTER TABLE [dbo].[Team]
    ADD [TeamLogoUrl] [nvarchar](max) NULL;
    
    PRINT 'TeamLogoUrl column added successfully!';
END
ELSE
BEGIN
    PRINT 'TeamLogoUrl column already exists.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Team]') AND name = 'Conference')
BEGIN
    ALTER TABLE [dbo].[Team]
    ADD [Conference] [nvarchar](10) NULL;
    
    PRINT 'Conference column added successfully!';
END
ELSE
BEGIN
    PRINT 'Conference column already exists.';
END
GO

-- =====================================================
-- 2. UPDATE TEAM LOGOS AND CONFERENCES BASED ON TEAM ID
-- =====================================================

-- East Conference Teams
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/atlanta-hawks.png', [Conference] = 'East' WHERE [Id] = 1;          -- Hawks
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/boston-celtics.png', [Conference] = 'East' WHERE [Id] = 2;         -- Celtics
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/brooklyn-nets.png', [Conference] = 'East' WHERE [Id] = 4;          -- Nets
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/charlotte-hornets.png', [Conference] = 'East' WHERE [Id] = 5;      -- Hornets
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/chicago-bulls.png', [Conference] = 'East' WHERE [Id] = 6;          -- Bulls
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/cleveland-cavaliers.png', [Conference] = 'East' WHERE [Id] = 7;    -- Cavaliers
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/detroito-pistons.png', [Conference] = 'East' WHERE [Id] = 10;      -- Pistons
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/indiana-pacers.png', [Conference] = 'East' WHERE [Id] = 15;        -- Pacers
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/miami-heat.png', [Conference] = 'East' WHERE [Id] = 20;            -- Heat
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/milwaykee-bucks.png', [Conference] = 'East' WHERE [Id] = 21;       -- Bucks
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/newYork-knicks.png', [Conference] = 'East' WHERE [Id] = 24;        -- Knicks
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/orlando-magic.png', [Conference] = 'East' WHERE [Id] = 26;         -- Magic
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/philadelphia-sixers.png', [Conference] = 'East' WHERE [Id] = 27;   -- Sixers
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/toronto-raptors.png', [Conference] = 'East' WHERE [Id] = 38;       -- Raptors
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/east/washington-wizards.png', [Conference] = 'East' WHERE [Id] = 41;    -- Wizards

-- West Conference Teams
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/dallas-mavericks.png', [Conference] = 'West' WHERE [Id] = 8;       -- Mavericks
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/denver-nuggets.png', [Conference] = 'West' WHERE [Id] = 9;         -- Nuggets
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/goldenState-warriors.png', [Conference] = 'West' WHERE [Id] = 11;  -- Warriors
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/houston-rockets.png', [Conference] = 'West' WHERE [Id] = 14;       -- Rockets
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/losAngeles-clippers.png', [Conference] = 'West' WHERE [Id] = 16;   -- Clippers
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/losAngeles-lakers.png', [Conference] = 'West' WHERE [Id] = 17;     -- Lakers
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/memphis-grizzlies.png', [Conference] = 'West' WHERE [Id] = 19;     -- Grizzlies
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/minnesota-timbewolves.png', [Conference] = 'West' WHERE [Id] = 22; -- Timberwolves
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/newOrleans-pelicans.png', [Conference] = 'West' WHERE [Id] = 23;   -- Pelicans
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/okc-thunder.png', [Conference] = 'West' WHERE [Id] = 25;           -- Thunder
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/phoenix-suns.png', [Conference] = 'West' WHERE [Id] = 28;          -- Suns
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/portland-trailblazers.png', [Conference] = 'West' WHERE [Id] = 29; -- Trail Blazers
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/sacramento-kings.png', [Conference] = 'West' WHERE [Id] = 30;      -- Kings
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/sanAntonio-spurs.png', [Conference] = 'West' WHERE [Id] = 31;      -- Spurs
UPDATE [dbo].[Team] SET [TeamLogoUrl] = '/teams/west/utah-jazz.png', [Conference] = 'West' WHERE [Id] = 40;             -- Jazz

PRINT 'Team logos and conferences updated successfully!';
GO

