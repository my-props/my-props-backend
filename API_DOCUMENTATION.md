# MyProps Backend API Documentation

## Overview
This documentation provides comprehensive information about the MyProps Backend API endpoints, with special focus on the `getPlayerVsTeamStatistics` endpoint and basic CRUD operations for players and teams.

**Base URL:** `http://localhost:3000/api` (or your deployed server URL)

---

## 🏀 Today's Games Endpoint

### `GET /api/games/today`

This endpoint retrieves today's games along with the next 8 upcoming games and previous 8 completed games in a single response. Perfect for displaying today's matchups, game schedules, upcoming games, and recent game history all on the same page. This single API call eliminates the need for multiple requests and provides all the data needed for a complete games overview.

> **Note on Scores:** Score data is automatically included for previous games (completed games) in the `previous8Games` response. Scores include total points, quarter-by-quarter breakdown (Q1-Q4), and win/loss indicators. Scores are only present for completed games and will be `null` for scheduled or upcoming games.

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `leagueId` | integer | No | Filter by specific league | `?leagueId=1` |
| `seasonId` | integer | No | Filter by specific season | `?seasonId=2024` |
| `status` | string | No | Filter by game status | `?status=Scheduled` |
| `limit` | integer | No | Limit number of results (default: 8) | `?limit=10` |

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `todayGames` | object | Today's games with totalCount |
| `next8Games` | object | Next 8 upcoming games with totalCount |
| `previous8Games` | object | Previous 8 completed games with totalCount |
| `filters` | object | Applied filters |

#### Game Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `gameId` | integer | Unique game identifier |
| `seasonId` | integer | Season identifier |
| `leagueId` | integer | League identifier |
| `leagueName` | string | League name |
| `startDate` | string | Game start date/time (ISO 8601) |
| `endDate` | string | Game end date/time (ISO 8601) |
| `duration` | string | Game duration |
| `clock` | string | Current game clock |
| `isHalftime` | boolean | Whether game is in halftime |
| `short` | integer | Game short identifier |
| `status` | string | Game status (Scheduled, In Progress, Finished, etc.) |
| `currentPeriod` | integer | Current period/quarter |
| `totalPeriod` | integer | Total periods in game |
| `endOfPeriod` | boolean | Whether current period has ended |
| `homeTeam` | object | Home team information |
| `visitorTeam` | object | Visitor team information |

#### Team Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Team unique identifier |
| `name` | string | Full team name |
| `nickName` | string | Team nickname |
| `code` | string | Team abbreviation code |
| `city` | string | Team city |
| `score` | object (optional) | Team score (only present for completed games in previous8Games) |

#### Score Object Fields (only for previous games)

| Field | Type | Description |
|-------|------|-------------|
| `total` | integer | Total points scored |
| `q1` | integer | Points scored in quarter 1 |
| `q2` | integer | Points scored in quarter 2 |
| `q3` | integer | Points scored in quarter 3 |
| `q4` | integer | Points scored in quarter 4 |
| `win` | integer | Win flag (1 if won, 0 if lost) |
| `loss` | integer | Loss flag (1 if lost, 0 if won) |

#### Example Requests

**1. Get all today's games:**
```bash
GET /api/games/today
```

**2. Get limited number of games:**
```bash
GET /api/games/today?limit=5
```

**3. Get games for specific league:**
```bash
GET /api/games/today?leagueId=1
```

**4. Get games for specific season:**
```bash
GET /api/games/today?seasonId=2024
```

**5. Get only scheduled games:**
```bash
GET /api/games/today?status=Scheduled
```

**6. Combined filters:**
```bash
GET /api/games/today?leagueId=1&seasonId=2024&limit=10&status=Scheduled
```

#### Example Response

```json
{
  "todayGames": {
    "games": [
      {
        "gameId": 12345,
        "seasonId": 2024,
        "leagueId": 1,
        "leagueName": "NBA",
        "startDate": "2024-01-15T20:00:00.000Z",
        "endDate": "2024-01-15T22:30:00.000Z",
        "duration": "2:30",
        "clock": "12:00",
        "isHalftime": false,
        "short": 1,
        "status": "Scheduled",
        "currentPeriod": 1,
        "totalPeriod": 4,
        "endOfPeriod": false,
        "homeTeam": {
          "id": 1,
          "name": "Los Angeles Lakers",
          "nickName": "Lakers",
          "code": "LAL",
          "city": "Los Angeles"
        },
        "visitorTeam": {
          "id": 2,
          "name": "Golden State Warriors",
          "nickName": "Warriors",
          "code": "GSW",
          "city": "San Francisco"
        }
      }
    ],
    "totalCount": 1
  },
  "next8Games": {
    "games": [
      {
        "gameId": 12346,
        "seasonId": 2024,
        "leagueId": 1,
        "leagueName": "NBA",
        "startDate": "2024-01-16T20:00:00.000Z",
        "endDate": "2024-01-16T22:30:00.000Z",
        "duration": "2:30",
        "clock": "00:00",
        "isHalftime": false,
        "short": 2,
        "status": "Scheduled",
        "currentPeriod": 1,
        "totalPeriod": 4,
        "endOfPeriod": false,
        "homeTeam": {
          "id": 3,
          "name": "Boston Celtics",
          "nickName": "Celtics",
          "code": "BOS",
          "city": "Boston"
        },
        "visitorTeam": {
          "id": 4,
          "name": "Miami Heat",
          "nickName": "Heat",
          "code": "MIA",
          "city": "Miami"
        }
      }
    ],
    "totalCount": 1
  },
  "previous8Games": {
    "games": [
      {
        "gameId": 12344,
        "seasonId": 2024,
        "leagueId": 1,
        "leagueName": "NBA",
        "startDate": "2024-01-14T20:00:00.000Z",
        "endDate": "2024-01-14T22:30:00.000Z",
        "duration": "2:30",
        "clock": "00:00",
        "isHalftime": false,
        "short": 3,
        "status": "Finished",
        "currentPeriod": 4,
        "totalPeriod": 4,
        "endOfPeriod": true,
        "homeTeam": {
          "id": 5,
          "name": "Chicago Bulls",
          "nickName": "Bulls",
          "code": "CHI",
          "city": "Chicago",
          "score": {
            "total": 112,
            "q1": 28,
            "q2": 32,
            "q3": 25,
            "q4": 27,
            "win": 1,
            "loss": 0
          }
        },
        "visitorTeam": {
          "id": 6,
          "name": "Detroit Pistons",
          "nickName": "Pistons",
          "code": "DET",
          "city": "Detroit",
          "score": {
            "total": 108,
            "q1": 25,
            "q2": 30,
            "q3": 26,
            "q4": 27,
            "win": 0,
            "loss": 1
          }
        }
      }
    ],
    "totalCount": 1
  },
  "filters": {}
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": "Invalid leagueId parameter"
}
```

**400 Bad Request:**
```json
{
  "error": "Invalid limit parameter"
}
```

**400 Bad Request:**
```json
{
  "error": "No games found for today"
}
```

#### JavaScript Examples

**1. Basic usage:**
```javascript
async function getTodaysGames(filters = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.leagueId) params.append('leagueId', filters.leagueId);
    if (filters.seasonId) params.append('seasonId', filters.seasonId);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await fetch(`/api/games/today?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching today\'s games:', error);
    throw error;
  }
}

// Usage
const gameData = await getTodaysGames();
// Access today's games: gameData.todayGames.games
// Access next 8 games: gameData.next8Games.games
// Access previous 8 games: gameData.previous8Games.games
```

**2. React Hook example:**
```javascript
import { useState, useEffect } from 'react';

function useTodaysGames(filters = {}) {
  const [todayGames, setTodayGames] = useState([]);
  const [nextGames, setNextGames] = useState([]);
  const [previousGames, setPreviousGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.append(key, value);
          }
        });

        const response = await fetch(`/api/games/today?${params}`);
        const data = await response.json();
        
        if (response.ok) {
          setTodayGames(data.todayGames.games);
          setNextGames(data.next8Games.games);
          setPreviousGames(data.previous8Games.games);
        } else {
          setError(new Error(data.error || 'Failed to fetch games'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, [JSON.stringify(filters)]);

  return { games, loading, error };
}

// Usage in component
function TodaysGamesComponent() {
  const [filters, setFilters] = useState({ limit: 8 });
  const { games, loading, error } = useTodaysGames(filters);

  if (loading) return <div>Loading today's games...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Today's Games ({games.length})</h2>
      {games.map(game => (
        <div key={game.gameId} className="game-card">
          <h3>{game.visitorTeam.name} @ {game.homeTeam.name}</h3>
          <p>Time: {new Date(game.startDate).toLocaleTimeString()}</p>
          <p>Status: {game.status}</p>
          <p>League: {game.leagueName}</p>
        </div>
      ))}
    </div>
  );
}
```

**3. Filter component:**
```javascript
function GamesFilter({ onFiltersChange }) {
  const [filters, setFilters] = useState({
    leagueId: '',
    seasonId: '',
    status: '',
    limit: 8
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="games-filter">
      <select 
        value={filters.leagueId} 
        onChange={(e) => handleFilterChange('leagueId', e.target.value)}
      >
        <option value="">All Leagues</option>
        <option value="1">NBA</option>
        <option value="2">WNBA</option>
      </select>
      
      <select 
        value={filters.seasonId} 
        onChange={(e) => handleFilterChange('seasonId', e.target.value)}
      >
        <option value="">All Seasons</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </select>
      
      <select 
        value={filters.status} 
        onChange={(e) => handleFilterChange('status', e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="Scheduled">Scheduled</option>
        <option value="In Progress">In Progress</option>
        <option value="Finished">Finished</option>
      </select>
      
      <input 
        type="number" 
        placeholder="Limit" 
        value={filters.limit} 
        onChange={(e) => handleFilterChange('limit', e.target.value)}
        min="1"
        max="50"
      />
    </div>
  );
}
```

---

## 🏀 Player vs Team Statistics Endpoint

### `GET /api/players/statistics`

This is the main endpoint for retrieving player statistics with flexible query parameters. It supports multiple query types including the `getPlayerVsTeamStatistics` functionality.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `playerId` | integer | ✅ Yes | The ID of the player to get statistics for |
| `queryType` | string | No | Type of statistics query (default: `vs-all-teams`) |
| `enemyTeamId` | integer | No | Enemy team ID (required for `vs-team` queries) |
| `enemyPosition` | string | No | Enemy position (required for `vs-position` queries) |
| `playerPosition` | string | No | Player position (required for `in-position-vs-team` queries) |
| `playerId2` | integer | No | Second player ID (required for `vs-player` queries) |
| `seasonId` | integer | No | Season ID filter |
| `fields` | string | No | Comma-separated list of fields to return |
| `groupBy` | string | No | Group by: `team`, `position`, `game`, `season` |
| `orderBy` | string | No | Field to order by (default: `AveragePoints`) |
| `orderDirection` | string | No | Order direction: `ASC` or `DESC` (default: `DESC`) |
| `limit` | integer | No | Limit number of results |

#### Query Types

1. **`vs-team`** - Player vs specific team statistics
   - Required: `playerId`, `enemyTeamId`
   - Optional: `seasonId`, `fields`, `groupBy`, `orderBy`, `orderDirection`, `limit`

2. **`vs-position`** - Player vs specific position statistics
   - Required: `playerId`, `enemyPosition`
   - Optional: `seasonId`, `fields`, `groupBy`, `orderBy`, `orderDirection`, `limit`

3. **`vs-all-teams`** - Player vs all teams statistics (default)
   - Required: `playerId`
   - Optional: `seasonId`, `fields`, `groupBy`, `orderBy`, `orderDirection`, `limit`

4. **`in-position-vs-team`** - Player in specific position vs team statistics
   - Required: `playerId`, `enemyTeamId`, `playerPosition`
   - Optional: `seasonId`, `fields`, `groupBy`, `orderBy`, `orderDirection`, `limit`

5. **`in-position-vs-all-teams`** - Player in specific position vs all teams statistics
   - Required: `playerId`, `playerPosition`
   - Optional: `seasonId`, `fields`, `groupBy`, `orderBy`, `orderDirection`, `limit`

6. **`vs-player`** - Player vs player statistics
   - Required: `playerId`, `playerId2`
   - Optional: `seasonId`, `fields`, `orderBy`, `orderDirection`, `limit`

#### Response Fields

The response includes the following statistical fields:

| Field | Type | Description |
|-------|------|-------------|
| `PlayerId` | integer | Player's unique identifier |
| `PlayerFirstName` | string | Player's first name |
| `PlayerLastName` | string | Player's last name |
| `PlayerPosition` | string | Player's position |
| `EnemyTeamId` | integer | Opponent team ID |
| `EnemyTeamName` | string | Opponent team name |
| `EnemyTeamNickName` | string | Opponent team nickname |
| `SeasonId` | integer | Season identifier |
| `SeasonYear` | integer | Season year |
| `AveragePoints` | number | Average points per game |
| `AverageRebounds` | number | Average rebounds per game |
| `AverageAssists` | number | Average assists per game |
| `AverageSteals` | number | Average steals per game |
| `AverageBlocks` | number | Average blocks per game |
| `AverageTurnovers` | number | Average turnovers per game |
| `AverageFieldGoalsMade` | number | Average field goals made |
| `AverageFieldGoalsAttempted` | number | Average field goals attempted |
| `AverageThreePointShotsMade` | number | Average 3-point shots made |
| `AverageThreePointShotsAttempted` | number | Average 3-point shots attempted |
| `AverageFreeThrowsMade` | number | Average free throws made |
| `AverageFreeThrowsAttempted` | number | Average free throws attempted |
| `AveragePersonalFouls` | number | Average personal fouls |
| `AveragePlusMinus` | number | Average plus/minus |
| `MaxPoints` | number | Maximum points in a game |
| `MinPoints` | number | Minimum points in a game |
| `GamesPlayed` | integer | Number of games played |
| `GamesOver20Points` | integer | Games with 20+ points |
| `GamesOver30Points` | integer | Games with 30+ points |
| `GamesOver40Points` | integer | Games with 40+ points |
| `LastUpdated` | string | Last update timestamp |

#### Example Requests

**1. Get LeBron James vs Lakers statistics:**
```bash
GET /api/players/statistics?playerId=123&queryType=vs-team&enemyTeamId=456
```

**2. Get player vs all teams for current season:**
```bash
GET /api/players/statistics?playerId=123&queryType=vs-all-teams&seasonId=2024
```

**3. Get specific fields only:**
```bash
GET /api/players/statistics?playerId=123&fields=AveragePoints,AverageRebounds,GamesPlayed
```

**4. Get player vs player comparison:**
```bash
GET /api/players/statistics?playerId=123&queryType=vs-player&playerId2=456
```

#### Example Response

```json
[
  {
    "PlayerId": 123,
    "PlayerFirstName": "LeBron",
    "PlayerLastName": "James",
    "PlayerPosition": "SF",
    "EnemyTeamId": 456,
    "EnemyTeamName": "Los Angeles Lakers",
    "EnemyTeamNickName": "Lakers",
    "SeasonId": 2024,
    "SeasonYear": 2024,
    "AveragePoints": 25.5,
    "AverageRebounds": 7.8,
    "AverageAssists": 8.2,
    "AverageSteals": 1.2,
    "AverageBlocks": 0.8,
    "AverageTurnovers": 3.1,
    "AverageFieldGoalsMade": 9.2,
    "AverageFieldGoalsAttempted": 18.5,
    "AverageThreePointShotsMade": 2.1,
    "AverageThreePointShotsAttempted": 6.3,
    "AverageFreeThrowsMade": 5.0,
    "AverageFreeThrowsAttempted": 6.8,
    "AveragePersonalFouls": 2.3,
    "AveragePlusMinus": 5.2,
    "MaxPoints": 45,
    "MinPoints": 12,
    "GamesPlayed": 15,
    "GamesOver20Points": 12,
    "GamesOver30Points": 5,
    "GamesOver40Points": 1,
    "LastUpdated": "2024-01-15T10:30:00Z"
  }
]
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": "Player ID is required"
}
```

**404 Not Found:**
```json
{
  "error": "Player statistics not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## 🎮 Game-by-Game Statistics Endpoint

### `GET /api/players/statistics/games`

This endpoint returns individual game statistics instead of aggregated averages. Perfect for showing each game as a separate row in your table.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `playerId` | integer | ✅ Yes | The ID of the player to get statistics for |
| `enemyTeamId` | integer | ✅ Yes | The ID of the enemy team |
| `seasonId` | integer | No | Season ID filter |
| `arena` | string | No | Arena name filter (currently disabled - Arena column not available in database) |
| `statType` | string | No | Stat type for over/under filter (TotalPoints, TotalRebounds, Assists, Steals, Blocks, Turnovers) |
| `overValue` | number | No | Minimum value for stat filter |
| `underValue` | number | No | Maximum value for stat filter |
| `orderBy` | string | No | Field to order by (default: GameDate) |
| `orderDirection` | string | No | Order direction: ASC or DESC (default: DESC) |
| `limit` | integer | No | Limit number of results |

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `GameId` | integer | Unique game identifier |
| `GameDate` | string | Date of the game |
| `Arena` | string | Arena where the game was played (currently null - Arena column not available in database) |
| `SeasonId` | integer | Season identifier |
| `SeasonYear` | integer | Season year |
| `TotalPoints` | number | Points scored in this game |
| `TotalRebounds` | number | Rebounds in this game |
| `Assists` | number | Assists in this game |
| `Steals` | number | Steals in this game |
| `Blocks` | number | Blocks in this game |
| `Turnovers` | number | Turnovers in this game |
| `FieldGoalsMade` | number | Field goals made |
| `FieldGoalsAttempted` | number | Field goals attempted |
| `FieldGoalPercentage` | string | Field goal percentage |
| `ThreePointShotsMade` | number | 3-point shots made |
| `ThreePointShotsAttempted` | number | 3-point shots attempted |
| `ThreePointShotPercentage` | string | 3-point shot percentage |
| `FreeThrowsMade` | number | Free throws made |
| `FreeThrowsAttempted` | number | Free throws attempted |
| `FreeThrowPercentage` | string | Free throw percentage |
| `PersonalFouls` | number | Personal fouls |
| `PlusMinus` | number | Plus/minus rating |
| `MinutesPlayed` | string | Minutes played |
| `PlayerPosition` | string | Player's position in this game |
| `PlayerFirstName` | string | Player's first name |
| `PlayerLastName` | string | Player's last name |
| `EnemyTeamName` | string | Enemy team name |
| `EnemyTeamNickName` | string | Enemy team nickname |
| `GameLocation` | string | Home or Away |
| `EnemyTeamId` | integer | Enemy team ID |

#### Example Requests

**1. Get LeBron James vs Lakers individual games:**
```bash
GET /api/players/statistics/games?playerId=265&enemyTeamId=11
```

**2. Filter by season:**
```bash
GET /api/players/statistics/games?playerId=265&enemyTeamId=11&seasonId=2024
```

**3. Filter games where player scored over 25 points:**
```bash
GET /api/players/statistics/games?playerId=265&enemyTeamId=11&statType=TotalPoints&overValue=25
```

**4. Get games with 20-30 points range:**
```bash
GET /api/players/statistics/games?playerId=265&enemyTeamId=11&statType=TotalPoints&overValue=20&underValue=30
```

**5. Order by points (ascending):**
```bash
GET /api/players/statistics/games?playerId=265&enemyTeamId=11&orderBy=TotalPoints&orderDirection=ASC
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "GameId": 12345,
      "GameDate": "2024-01-15T20:00:00.000Z",
      "Arena": null,
      "SeasonId": 2024,
      "SeasonYear": 2024,
      "TotalPoints": 28,
      "TotalRebounds": 7,
      "Assists": 9,
      "Steals": 2,
      "Blocks": 1,
      "Turnovers": 3,
      "FieldGoalsMade": 10,
      "FieldGoalsAttempted": 18,
      "FieldGoalPercentage": "55.6%",
      "ThreePointShotsMade": 3,
      "ThreePointShotsAttempted": 7,
      "ThreePointShotPercentage": "42.9%",
      "FreeThrowsMade": 5,
      "FreeThrowsAttempted": 6,
      "FreeThrowPercentage": "83.3%",
      "PersonalFouls": 2,
      "PlusMinus": 8,
      "MinutesPlayed": "35:42",
      "PlayerPosition": "SF",
      "PlayerFirstName": "LeBron",
      "PlayerLastName": "James",
      "EnemyTeamName": "Golden State Warriors",
      "EnemyTeamNickName": "Warriors",
      "GameLocation": "Home",
      "EnemyTeamId": 11
    },
    {
      "GameId": 12346,
      "GameDate": "2024-01-10T19:30:00.000Z",
      "Arena": null,
      "SeasonId": 2024,
      "SeasonYear": 2024,
      "TotalPoints": 32,
      "TotalRebounds": 8,
      "Assists": 7,
      "Steals": 1,
      "Blocks": 2,
      "Turnovers": 2,
      "FieldGoalsMade": 12,
      "FieldGoalsAttempted": 20,
      "FieldGoalPercentage": "60.0%",
      "ThreePointShotsMade": 4,
      "ThreePointShotsAttempted": 8,
      "ThreePointShotPercentage": "50.0%",
      "FreeThrowsMade": 4,
      "FreeThrowsAttempted": 5,
      "FreeThrowPercentage": "80.0%",
      "PersonalFouls": 3,
      "PlusMinus": 12,
      "MinutesPlayed": "38:15",
      "PlayerPosition": "SF",
      "PlayerFirstName": "LeBron",
      "PlayerLastName": "James",
      "EnemyTeamName": "Golden State Warriors",
      "EnemyTeamNickName": "Warriors",
      "GameLocation": "Away",
      "EnemyTeamId": 11
    }
  ],
  "count": 2,
  "filters": {
    "playerId": 265,
    "enemyTeamId": 11
  }
}
```

---

## 🏆 Team vs Team Player Statistics Endpoint

### `GET /api/teams/{teamId1}/vs/{teamId2}/players`

This endpoint provides comprehensive player statistics for team vs team matchups. It shows all players from both teams with their individual statistics against each other, including all the fields you requested.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teamId1` | integer | ✅ Yes | First team ID (e.g., Lakers) |
| `teamId2` | integer | ✅ Yes | Second team ID (e.g., Warriors) |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `seasonId` | integer | No | Season ID filter |
| `position` | string | No | Position filter (PG, SG, SF, PF, C) |
| `orderBy` | string | No | Field to order by (default: AveragePoints) |
| `orderDirection` | string | No | Order direction: ASC or DESC (default: DESC) |
| `limit` | integer | No | Limit number of results |

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `PlayerId` | integer | Player's unique identifier |
| `FirstName` | string | Player's first name |
| `LastName` | string | Player's last name |
| `Position` | string | Player's position |
| `TeamId` | integer | Player's team ID |
| `TeamName` | string | Player's team name |
| `TeamNickName` | string | Player's team nickname |
| `EnemyTeamId` | integer | Opponent team ID |
| `EnemyTeamName` | string | Opponent team name |
| `EnemyTeamNickName` | string | Opponent team nickname |
| `SeasonId` | integer | Season identifier |
| `SeasonYear` | integer | Season year |
| `AveragePoints` | number | Average points per game |
| `AverageRebounds` | number | Average rebounds per game |
| `AverageAssists` | number | Average assists per game |
| `AverageSteals` | number | Average steals per game |
| `AverageBlocks` | number | Average blocks per game |
| `AverageTurnovers` | number | Average turnovers per game |
| `AveragePersonalFouls` | number | Average personal fouls per game |
| `AveragePointsPlusRebounds` | number | Average points + rebounds |
| `AveragePointsPlusReboundsPlusAssists` | number | Average points + rebounds + assists |
| `AveragePointsPlusAssists` | number | Average points + assists |
| `AverageAssistsPlusRebounds` | number | Average assists + rebounds |
| `AverageOverPoints` | number | Average over points |
| `GamesOver20Points` | integer | Games with 20+ points |
| `GamesOver25Points` | integer | Games with 25+ points |
| `GamesOver30Points` | integer | Games with 30+ points |
| `GamesOver35Points` | integer | Games with 35+ points |
| `GamesOver40Points` | integer | Games with 40+ points |
| `GamesOver5Rebounds` | integer | Games with 5+ rebounds |
| `GamesOver10Rebounds` | integer | Games with 10+ rebounds |
| `GamesOver15Rebounds` | integer | Games with 15+ rebounds |
| `GamesOver5Assists` | integer | Games with 5+ assists |
| `GamesOver10Assists` | integer | Games with 10+ assists |
| `GamesOver15Assists` | integer | Games with 15+ assists |
| `FieldGoalPercentage` | number | Field goal percentage |
| `ThreePointPercentage` | number | Three-point percentage |
| `FreeThrowPercentage` | number | Free throw percentage |
| `MaxPoints` | number | Maximum points in a game |
| `MinPoints` | number | Minimum points in a game |
| `MaxRebounds` | number | Maximum rebounds in a game |
| `MinRebounds` | number | Minimum rebounds in a game |
| `MaxAssists` | number | Maximum assists in a game |
| `MinAssists` | number | Minimum assists in a game |
| `GamesPlayed` | integer | Number of games played against opponent |
| `HomeGames` | integer | Number of home games |
| `AwayGames` | integer | Number of away games |
| `PointsStandardDeviation` | number | Points consistency metric |
| `ReboundsStandardDeviation` | number | Rebounds consistency metric |
| `AssistsStandardDeviation` | number | Assists consistency metric |

#### Example Requests

**1. Get Lakers vs Warriors player statistics:**
```bash
GET /api/teams/1/vs/2/players
```

**2. Filter by season and position:**
```bash
GET /api/teams/1/vs/2/players?seasonId=2024&position=PG
```

**3. Order by rebounds and limit results:**
```bash
GET /api/teams/1/vs/2/players?orderBy=AverageRebounds&orderDirection=DESC&limit=10
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "team1": {
      "teamId": 1,
      "teamName": "Los Angeles Lakers",
      "players": [
        {
          "PlayerId": 123,
          "FirstName": "LeBron",
          "LastName": "James",
          "Position": "SF",
          "TeamId": 1,
          "TeamName": "Los Angeles Lakers",
          "TeamNickName": "Lakers",
          "EnemyTeamId": 2,
          "EnemyTeamName": "Golden State Warriors",
          "EnemyTeamNickName": "Warriors",
          "SeasonId": 2024,
          "SeasonYear": 2024,
          "AveragePoints": 28.5,
          "AverageRebounds": 8.2,
          "AverageAssists": 9.1,
          "AverageSteals": 1.3,
          "AverageBlocks": 0.8,
          "AverageTurnovers": 3.2,
          "AveragePersonalFouls": 2.1,
          "AveragePointsPlusRebounds": 36.7,
          "AveragePointsPlusReboundsPlusAssists": 45.8,
          "AveragePointsPlusAssists": 37.6,
          "AverageAssistsPlusRebounds": 17.3,
          "AverageOverPoints": 28.5,
          "GamesOver20Points": 8,
          "GamesOver25Points": 6,
          "GamesOver30Points": 4,
          "GamesOver35Points": 2,
          "GamesOver40Points": 1,
          "GamesOver5Rebounds": 9,
          "GamesOver10Rebounds": 5,
          "GamesOver15Rebounds": 1,
          "GamesOver5Assists": 8,
          "GamesOver10Assists": 4,
          "GamesOver15Assists": 1,
          "FieldGoalPercentage": 55.2,
          "ThreePointPercentage": 38.5,
          "FreeThrowPercentage": 82.1,
          "MaxPoints": 45,
          "MinPoints": 18,
          "MaxRebounds": 15,
          "MinRebounds": 3,
          "MaxAssists": 15,
          "MinAssists": 4,
          "GamesPlayed": 10,
          "HomeGames": 5,
          "AwayGames": 5,
          "PointsStandardDeviation": 8.2,
          "ReboundsStandardDeviation": 3.1,
          "AssistsStandardDeviation": 2.8
        }
      ]
    },
    "team2": {
      "teamId": 2,
      "teamName": "Golden State Warriors",
      "players": [
        {
          "PlayerId": 456,
          "FirstName": "Stephen",
          "LastName": "Curry",
          "Position": "PG",
          "TeamId": 2,
          "TeamName": "Golden State Warriors",
          "TeamNickName": "Warriors",
          "EnemyTeamId": 1,
          "EnemyTeamName": "Los Angeles Lakers",
          "EnemyTeamNickName": "Lakers",
          "SeasonId": 2024,
          "SeasonYear": 2024,
          "AveragePoints": 32.1,
          "AverageRebounds": 5.8,
          "AverageAssists": 7.2,
          "AverageSteals": 1.8,
          "AverageBlocks": 0.3,
          "AverageTurnovers": 2.9,
          "AveragePersonalFouls": 2.5,
          "AveragePointsPlusRebounds": 37.9,
          "AveragePointsPlusReboundsPlusAssists": 45.1,
          "AveragePointsPlusAssists": 39.3,
          "AverageAssistsPlusRebounds": 13.0,
          "AverageOverPoints": 32.1,
          "GamesOver20Points": 9,
          "GamesOver25Points": 8,
          "GamesOver30Points": 6,
          "GamesOver35Points": 3,
          "GamesOver40Points": 2,
          "GamesOver5Rebounds": 7,
          "GamesOver10Rebounds": 2,
          "GamesOver15Rebounds": 0,
          "GamesOver5Assists": 8,
          "GamesOver10Assists": 3,
          "GamesOver15Assists": 0,
          "FieldGoalPercentage": 48.7,
          "ThreePointPercentage": 42.3,
          "FreeThrowPercentage": 91.5,
          "MaxPoints": 52,
          "MinPoints": 22,
          "MaxRebounds": 12,
          "MinRebounds": 2,
          "MaxAssists": 12,
          "MinAssists": 3,
          "GamesPlayed": 10,
          "HomeGames": 5,
          "AwayGames": 5,
          "PointsStandardDeviation": 9.8,
          "ReboundsStandardDeviation": 2.4,
          "AssistsStandardDeviation": 2.1
        }
      ]
    },
    "totalPlayers": 2,
    "filters": {}
  }
}
```

### `GET /api/teams/{teamId1}/vs/{teamId2}/players/summary`

Get a summary of team vs team player statistics with key metrics.

#### Example Response

```json
{
  "success": true,
  "data": {
    "team1": {
      "totalPlayers": 15,
      "averagePoints": 24.3,
      "averageRebounds": 6.8,
      "averageAssists": 5.2,
      "totalGamesPlayed": 150,
      "topScorer": {
        "FirstName": "LeBron",
        "LastName": "James",
        "AveragePoints": 28.5
      },
      "topRebounder": {
        "FirstName": "Anthony",
        "LastName": "Davis",
        "AverageRebounds": 12.1
      },
      "topAssistMan": {
        "FirstName": "LeBron",
        "LastName": "James",
        "AverageAssists": 9.1
      }
    },
    "team2": {
      "totalPlayers": 14,
      "averagePoints": 22.7,
      "averageRebounds": 5.9,
      "averageAssists": 4.8,
      "totalGamesPlayed": 140,
      "topScorer": {
        "FirstName": "Stephen",
        "LastName": "Curry",
        "AveragePoints": 32.1
      },
      "topRebounder": {
        "FirstName": "Draymond",
        "LastName": "Green",
        "AverageRebounds": 8.3
      },
      "topAssistMan": {
        "FirstName": "Stephen",
        "LastName": "Curry",
        "AverageAssists": 7.2
      }
    },
    "totalPlayers": 29,
    "filters": {}
  }
}
```

---

## 🎯 Team vs All Teams Player Statistics Endpoint

### `GET /api/teams/{teamId}/vs-all/players`

This endpoint provides aggregated player statistics for a team against all other teams. It shows all players from the specified team with their combined statistics across all opponents they've faced. This is particularly useful for understanding overall team performance and player averages across the entire league.

> **Note:** The statistics shown are the **current team** for each player (determined by their most recent game). This ensures that even if a player has changed teams, their statistics are grouped under their current team for consistency.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teamId` | integer | ✅ Yes | Team ID to get statistics for |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `seasonId` | integer | No | Season ID filter |
| `position` | string | No | Position filter (PG, SG, SF, PF, C) |
| `orderBy` | string | No | Field to order by (default: AveragePoints) |
| `orderDirection` | string | No | Order direction: ASC or DESC (default: DESC) |
| `limit` | integer | No | Limit number of results |

#### Response Fields

The response includes the same fields as the team vs team endpoint, but with aggregated values across all opponents:

| Field | Type | Description |
|-------|------|-------------|
| `PlayerId` | integer | Player's unique identifier |
| `FirstName` | string | Player's first name |
| `LastName` | string | Player's last name |
| `Position` | string | Player's position |
| `TeamId` | integer | Player's current team ID |
| `TeamName` | string | Player's current team name |
| `TeamNickName` | string | Player's current team nickname |
| `AveragePoints` | number | Average points across all opponents |
| `AverageRebounds` | number | Average rebounds across all opponents |
| `AverageAssists` | number | Average assists across all opponents |
| `GamesOver20Points` | integer | Total games with 20+ points (across all opponents) |
| `GamesOver25Points` | integer | Total games with 25+ points (across all opponents) |
| `GamesOver30Points` | integer | Total games with 30+ points (across all opponents) |
| `GamesPlayed` | integer | Total games played across all opponents |
| `HomeGames` | integer | Total home games |
| `AwayGames` | integer | Total away games |
| ... | ... | (All other fields from team vs team endpoint) |

#### Example Requests

**1. Get Lakers players' statistics against all teams:**
```bash
GET /api/teams/1/vs-all/players
```

**2. Filter by season and position:**
```bash
GET /api/teams/1/vs-all/players?seasonId=2024&position=PG
```

**3. Order by rebounds and limit results:**
```bash
GET /api/teams/1/vs-all/players?orderBy=AverageRebounds&orderDirection=DESC&limit=10
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "teamId": 1,
    "teamName": "Los Angeles Lakers",
    "teamNickName": "Lakers",
    "players": [
      {
        "PlayerId": 123,
        "FirstName": "LeBron",
        "LastName": "James",
        "Position": "SF",
        "TeamId": 1,
        "TeamName": "Los Angeles Lakers",
        "TeamNickName": "Lakers",
        "AveragePoints": 25.2,
        "AverageRebounds": 7.8,
        "AverageAssists": 8.1,
        "AverageSteals": 1.5,
        "AverageBlocks": 0.7,
        "AverageTurnovers": 3.5,
        "AveragePersonalFouls": 2.3,
        "AveragePointsPlusRebounds": 33.0,
        "AveragePointsPlusReboundsPlusAssists": 41.1,
        "AveragePointsPlusAssists": 33.3,
        "AverageAssistsPlusRebounds": 15.9,
        "AverageOverPoints": 25.2,
        "GamesOver20Points": 45,
        "GamesOver25Points": 28,
        "GamesOver30Points": 15,
        "GamesOver35Points": 8,
        "GamesOver40Points": 3,
        "GamesOver5Rebounds": 52,
        "GamesOver10Rebounds": 18,
        "GamesOver15Rebounds": 5,
        "GamesOver5Assists": 48,
        "GamesOver10Assists": 22,
        "GamesOver15Assists": 8,
        "AverageFieldGoalsMade": 9.8,
        "AverageFieldGoalsAttempted": 18.2,
        "AverageThreePointShotsMade": 2.3,
        "AverageThreePointShotsAttempted": 6.1,
        "AverageFreeThrowsMade": 5.8,
        "AverageFreeThrowsAttempted": 7.1,
        "FieldGoalPercentage": 53.8,
        "ThreePointPercentage": 37.7,
        "FreeThrowPercentage": 81.7,
        "MaxPoints": 51,
        "MinPoints": 8,
        "MaxRebounds": 19,
        "MinRebounds": 1,
        "MaxAssists": 17,
        "MinAssists": 2,
        "GamesPlayed": 65,
        "HomeGames": 33,
        "AwayGames": 32,
        "RecentAveragePoints": 24.8,
        "RecentAverageRebounds": 7.5,
        "RecentAverageAssists": 8.0,
        "PointsStandardDeviation": 7.2,
        "ReboundsStandardDeviation": 3.8,
        "AssistsStandardDeviation": 4.1
      }
    ],
    "totalPlayers": 15,
    "filters": {}
  }
}
```

#### JavaScript Examples

**1. Get team vs all teams statistics:**
```javascript
async function getTeamVsAllStats(teamId) {
  try {
    const response = await fetch(`/api/teams/${teamId}/vs-all/players`);
    const data = await response.json();
    
    if (data.success) {
      console.log('Team players:', data.data.players);
      return data.data;
    } else {
      throw new Error('Failed to fetch team vs all stats');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
getTeamVsAllStats(1); // Lakers vs all teams
```

**2. Filtered team vs all teams statistics:**
```javascript
async function getFilteredTeamVsAllStats(teamId, filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.seasonId) params.append('seasonId', filters.seasonId);
  if (filters.position) params.append('position', filters.position);
  if (filters.orderBy) params.append('orderBy', filters.orderBy);
  if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);
  if (filters.limit) params.append('limit', filters.limit);

  try {
    const response = await fetch(`/api/teams/${teamId}/vs-all/players?${params}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
getFilteredTeamVsAllStats(1, {
  seasonId: 2024,
  position: 'SF',
  orderBy: 'AveragePoints',
  orderDirection: 'DESC',
  limit: 5
});
```

**3. React Hook for team vs all statistics:**
```javascript
import { useState, useEffect } from 'react';

function useTeamVsAllStats(teamId, filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.append(key, value);
          }
        });

        const response = await fetch(`/api/teams/${teamId}/vs-all/players?${params}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(new Error('Failed to fetch data'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (teamId) {
      fetchData();
    }
  }, [teamId, JSON.stringify(filters)]);

  return { data, loading, error };
}

// Usage
function LakersStats() {
  const { data, loading, error } = useTeamVsAllStats(1, {
    position: 'PG',
    orderBy: 'AverageAssists',
    orderDirection: 'DESC'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.teamName} - All Teams Statistics</h1>
      <ul>
        {data.players.map(player => (
          <li key={player.PlayerId}>
            {player.FirstName} {player.LastName} - {player.AveragePoints} PPG
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🔄 Two Teams vs All Teams Endpoint

### `GET /api/teams/{teamId1}/and/{teamId2}/vs-all/players`

This endpoint provides a **single API call** to get both teams' aggregated statistics against all teams at once. Perfect for toggling between "Team vs Team" view and "Team vs All Teams" view in your frontend.

> **Use Case:** When your frontend component has 2 team IDs stored and you want to toggle between:
> - **Team vs Team view**: Shows stats from games where the two teams played each other
> - **Team vs All Teams view**: Shows each team's aggregated stats against all other teams

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teamId1` | integer | ✅ Yes | First team ID |
| `teamId2` | integer | ✅ Yes | Second team ID |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `seasonId` | integer | No | Season ID filter |
| `position` | string | No | Position filter (PG, SG, SF, PF, C) |
| `orderBy` | string | No | Field to order by (default: AveragePoints) |
| `orderDirection` | string | No | Order direction: ASC or DESC (default: DESC) |
| `limit` | integer | No | Limit number of results |

#### Response Structure

```json
{
  "success": true,
  "data": {
    "team1": {
      "teamId": 1,
      "teamName": "Los Angeles Lakers",
      "teamNickName": "Lakers",
      "players": [...],
      "totalPlayers": 15
    },
    "team2": {
      "teamId": 2,
      "teamName": "Los Angeles Clippers",
      "teamNickName": "Clippers",
      "players": [...],
      "totalPlayers": 14
    },
    "totalPlayers": 29,
    "filters": {}
  }
}
```

#### Example Requests

**1. Get Lakers and Clippers vs all teams statistics:**
```bash
GET /api/teams/1/and/2/vs-all/players
```

**2. Filter by season:**
```bash
GET /api/teams/1/and/2/vs-all/players?seasonId=2024
```

**3. Filter by position:**
```bash
GET /api/teams/1/and/2/vs-all/players?position=PG
```

#### JavaScript Examples

**1. Toggle between Team vs Team and Team vs All Teams:**
```javascript
const TOGGLE_MODES = {
  TEAM_VS_TEAM: 'team-vs-team',
  TEAM_VS_ALL: 'team-vs-all'
};

async function fetchPlayerStats(teamId1, teamId2, mode, filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.seasonId) params.append('seasonId', filters.seasonId);
  if (filters.position) params.append('position', filters.position);
  if (filters.orderBy) params.append('orderBy', filters.orderBy);
  if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);
  if (filters.limit) params.append('limit', filters.limit);

  let url;
  
  if (mode === TOGGLE_MODES.TEAM_VS_TEAM) {
    // Lakers vs Clippers (direct matchup)
    url = `/api/teams/${teamId1}/vs/${teamId2}/players?${params}`;
  } else {
    // Lakers vs All Teams & Clippers vs All Teams
    url = `/api/teams/${teamId1}/and/${teamId2}/vs-all/players?${params}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
const teamStats = await fetchPlayerStats(1, 2, TOGGLE_MODES.TEAM_VS_TEAM);
// vs.
const allStats = await fetchPlayerStats(1, 2, TOGGLE_MODES.TEAM_VS_ALL);
```

**2. React Component with Toggle Switch:**
```javascript
import { useState, useEffect } from 'react';

function TeamComparison({ teamId1, teamId2 }) {
  const [mode, setMode] = useState('team-vs-team'); // or 'team-vs-all'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        const url = mode === 'team-vs-team'
          ? `/api/teams/${teamId1}/vs/${teamId2}/players?${params}`
          : `/api/teams/${teamId1}/and/${teamId2}/vs-all/players?${params}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(new Error('Failed to fetch data'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (teamId1 && teamId2) {
      fetchData();
    }
  }, [teamId1, teamId2, mode]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="toggle-switch">
        <button 
          onClick={() => setMode('team-vs-team')}
          className={mode === 'team-vs-team' ? 'active' : ''}
        >
          Team vs Team
        </button>
        <button 
          onClick={() => setMode('team-vs-all')}
          className={mode === 'team-vs-all' ? 'active' : ''}
        >
          Team vs All
        </button>
      </div>

      {mode === 'team-vs-team' ? (
        // Team vs Team view
        <div>
          <h2>{data.team1.teamName} vs {data.team2.teamName}</h2>
          <div className="two-columns">
            <TeamTable title={data.team1.teamName} players={data.team1.players} />
            <TeamTable title={data.team2.teamName} players={data.team2.players} />
          </div>
        </div>
      ) : (
        // Team vs All Teams view
        <div>
          <div className="two-columns">
            <div>
              <h2>{data.team1.teamName} vs All Teams</h2>
              <TeamTable 
                title={data.team1.teamName} 
                players={data.team1.players}
                showCurrentTeamMode={true}
              />
            </div>
            <div>
              <h2>{data.team2.teamName} vs All Teams</h2>
              <TeamTable 
                title={data.team2.teamName} 
                players={data.team2.players}
                showCurrentTeamMode={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**3. Vue Component Example:**
```javascript
export default {
  data() {
    return {
      teamId1: 1,
      teamId2: 2,
      mode: 'team-vs-team', // or 'team-vs-all'
      data: null,
      loading: false,
      error: null
    };
  },
  async mounted() {
    await this.fetchStats();
  },
  watch: {
    mode() {
      this.fetchStats();
    }
  },
  methods: {
    async fetchStats() {
      this.loading = true;
      this.error = null;
      
      try {
        const url = this.mode === 'team-vs-team'
          ? `/api/teams/${this.teamId1}/vs/${this.teamId2}/players`
          : `/api/teams/${this.teamId1}/and/${this.teamId2}/vs-all/players`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
          this.data = result.data;
        } else {
          this.error = 'Failed to fetch data';
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    toggleMode(newMode) {
      this.mode = newMode;
    }
  }
}
```

#### Differences

| Feature | Team vs Team | Team vs All Teams |
|---------|--------------|-------------------|
| **Endpoint** | `/api/teams/{id1}/vs/{id2}/players` | `/api/teams/{id1}/and/{id2}/vs-all/players` |
| **Shows** | Direct matchup statistics | Aggregated stats vs all opponents |
| **Use Case** | Head-to-head comparison | Overall team performance |
| **Response** | Split by team1/team2 | Split by team1/team2 (aggregated) |

---

#### JavaScript Examples

**1. Basic team vs team statistics:**
```javascript
// Fetch Lakers vs Warriors player statistics
async function getTeamVsTeamStats(teamId1, teamId2) {
  try {
    const response = await fetch(`/api/teams/${teamId1}/vs/${teamId2}/players`);
    const data = await response.json();
    
    if (data.success) {
      console.log('Team 1 players:', data.data.team1.players);
      console.log('Team 2 players:', data.data.team2.players);
      return data.data;
    } else {
      throw new Error('Failed to fetch team vs team statistics');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
getTeamVsTeamStats(1, 2); // Lakers vs Warriors
```

**2. Filtered team vs team statistics:**
```javascript
// Get point guards only for Lakers vs Warriors in 2024 season
async function getFilteredTeamVsTeamStats(teamId1, teamId2, filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.seasonId) params.append('seasonId', filters.seasonId);
  if (filters.position) params.append('position', filters.position);
  if (filters.orderBy) params.append('orderBy', filters.orderBy);
  if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);
  if (filters.limit) params.append('limit', filters.limit);

  try {
    const response = await fetch(`/api/teams/${teamId1}/vs/${teamId2}/players?${params}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
getFilteredTeamVsTeamStats(1, 2, {
  seasonId: 2024,
  position: 'PG',
  orderBy: 'AveragePoints',
  orderDirection: 'DESC',
  limit: 5
});
```

**3. Team vs team summary:**
```javascript
// Get team vs team summary statistics
async function getTeamVsTeamSummary(teamId1, teamId2, seasonId = null) {
  const params = seasonId ? `?seasonId=${seasonId}` : '';
  
  try {
    const response = await fetch(`/api/teams/${teamId1}/vs/${teamId2}/players/summary${params}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
getTeamVsTeamSummary(1, 2, 2024);
```

#### React Hook Examples

**1. Custom hook for team vs team statistics:**
```javascript
import { useState, useEffect } from 'react';

function useTeamVsTeamStats(teamId1, teamId2, filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.append(key, value);
          }
        });

        const response = await fetch(`/api/teams/${teamId1}/vs/${teamId2}/players?${params}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(new Error('Failed to fetch data'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (teamId1 && teamId2) {
      fetchData();
    }
  }, [teamId1, teamId2, JSON.stringify(filters)]);

  return { data, loading, error };
}

// Usage in component
function TeamVsTeamComponent() {
  const { data, loading, error } = useTeamVsTeamStats(1, 2, {
    seasonId: 2024,
    position: 'PG'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <h2>{data.team1.teamName} vs {data.team2.teamName}</h2>
      <div>
        <h3>{data.team1.teamName} Players</h3>
        {data.team1.players.map(player => (
          <div key={player.PlayerId}>
            {player.FirstName} {player.LastName} - {player.AveragePoints} PPG
          </div>
        ))}
      </div>
      <div>
        <h3>{data.team2.teamName} Players</h3>
        {data.team2.players.map(player => (
          <div key={player.PlayerId}>
            {player.FirstName} {player.LastName} - {player.AveragePoints} PPG
          </div>
        ))}
      </div>
    </div>
  );
}
```

**2. Advanced filtering component:**
```javascript
import { useState } from 'react';

function TeamVsTeamFilter({ teamId1, teamId2 }) {
  const [filters, setFilters] = useState({
    seasonId: null,
    position: '',
    orderBy: 'AveragePoints',
    orderDirection: 'DESC',
    limit: null
  });
  
  const { data, loading, error } = useTeamVsTeamStats(teamId1, teamId2, filters);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? null : value
    }));
  };

  return (
    <div>
      <div className="filters">
        <select 
          value={filters.seasonId || ''} 
          onChange={(e) => handleFilterChange('seasonId', e.target.value)}
        >
          <option value="">All Seasons</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
        
        <select 
          value={filters.position} 
          onChange={(e) => handleFilterChange('position', e.target.value)}
        >
          <option value="">All Positions</option>
          <option value="PG">Point Guard</option>
          <option value="SG">Shooting Guard</option>
          <option value="SF">Small Forward</option>
          <option value="PF">Power Forward</option>
          <option value="C">Center</option>
        </select>
        
        <select 
          value={filters.orderBy} 
          onChange={(e) => handleFilterChange('orderBy', e.target.value)}
        >
          <option value="AveragePoints">Points</option>
          <option value="AverageRebounds">Rebounds</option>
          <option value="AverageAssists">Assists</option>
          <option value="GamesPlayed">Games Played</option>
        </select>
        
        <select 
          value={filters.orderDirection} 
          onChange={(e) => handleFilterChange('orderDirection', e.target.value)}
        >
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          {/* Render your data here */}
        </div>
      )}
    </div>
  );
}
```

---

## 👥 Basic Player Endpoints

### `GET /api/players`

Get all players in the database.

**Response:**
```json
[
  {
    "Id": 123,
    "FirstName": "LeBron",
    "LastName": "James",
    "BirthDate": "1984-12-30T00:00:00.000Z",
    "BirthCountry": "United States",
    "NbaYearStart": 2003,
    "NbaYearPro": 21,
    "HeightFeets": "6",
    "HeightInches": "9",
    "HeightMeters": "2.06",
    "WeightPounds": "250",
    "WeightKilograms": "113",
    "College": "St. Vincent-St. Mary High School",
    "Affiliation": "United States",
    "InactiveDate": null,
    "Active": true,
    "CreatedAt": "2024-01-01T00:00:00.000Z",
    "UpdatedAt": "2024-01-15T10:30:00.000Z",
    "Position": "SF",
    "Photo": "/src/assets/players/lebron_james.jpg"
  }
]
```

### `GET /api/players/:id`

Get a specific player by ID.

**Parameters:**
- `id` (integer, required) - Player ID

**Response:** Same as above but single object instead of array.

### `GET /api/players/teams/:teamId/players`

Get all players for a specific team.

**Parameters:**
- `teamId` (integer, required) - Team ID

**Response:**
```json
[
  {
    "Id": 123,
    "FirstName": "LeBron",
    "LastName": "James"
  }
]
```

### `GET /api/players/position/:position`

Get all players by position.

**Parameters:**
- `position` (string, required) - Player position (PG, SG, SF, PF, C)

**Response:** Array of player objects (same structure as GET all players).

---

## 🏆 Basic Team Endpoints

### `GET /api/teams`

Get all teams in the database.

**Response:**
```json
[
  {
    "Id": 456,
    "Name": "Los Angeles Lakers",
    "NickName": "Lakers",
    "Code": "LAL",
    "City": "Los Angeles",
    "IsAllStar": false,
    "IsNbaFranchise": true,
    "InactiveDate": null,
    "Active": true,
    "CreatedAt": "2024-01-01T00:00:00.000Z",
    "UpdatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### `GET /api/teams/:id`

Get a specific team by ID.

**Parameters:**
- `id` (integer, required) - Team ID

**Response:** Same as above but single object instead of array.

### `GET /api/teams/leagues/:leagueId/teams`

Get all teams for a specific league.

**Parameters:**
- `leagueId` (integer, required) - League ID

**Response:** Array of team objects.

### `GET /api/teams/city/:city`

Get all teams by city.

**Parameters:**
- `city` (string, required) - City name

**Response:** Array of team objects.

---

## 🔍 Additional Utility Endpoints

### `GET /api/players/statistics/query-types`

Get available query types and their parameters for the statistics endpoint.

**Response:**
```json
{
  "vs-team": {
    "description": "Player vs specific team statistics",
    "required": ["playerId", "enemyTeamId"],
    "optional": ["seasonId", "fields", "groupBy", "orderBy", "orderDirection", "limit"]
  },
  "vs-all-teams": {
    "description": "Player vs all teams statistics",
    "required": ["playerId"],
    "optional": ["seasonId", "fields", "groupBy", "orderBy", "orderDirection", "limit"]
  }
  // ... other query types
}
```

### `GET /health`

Health check endpoint to verify API status.

**Response:**
```json
{
  "success": true,
  "status": "OK",
  "message": "MyProps Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

---

## 🚀 Frontend Integration Examples

### JavaScript/TypeScript Examples

**1. Fetch player vs team statistics:**
```javascript
async function getPlayerVsTeamStats(playerId, teamId) {
  try {
    const response = await fetch(
      `/api/players/statistics?playerId=${playerId}&queryType=vs-team&enemyTeamId=${teamId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching player stats:', error);
    throw error;
  }
}
```

**2. Fetch all players:**
```javascript
async function getAllPlayers() {
  try {
    const response = await fetch('/api/players');
    const players = await response.json();
    return players;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
}
```

**3. Fetch all teams:**
```javascript
async function getAllTeams() {
  try {
    const response = await fetch('/api/teams');
    const teams = await response.json();
    return teams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
}

**4. Fetch player vs team game-by-game statistics:**
```javascript
async function getPlayerGameStats(playerId, enemyTeamId, filters = {}) {
  try {
    const params = new URLSearchParams({
      playerId: playerId,
      enemyTeamId: enemyTeamId,
      ...filters
    });
    
    const response = await fetch(`/api/players/statistics/games?${params}`);
    const result = await response.json();
    return result.data; // Returns array of individual games
  } catch (error) {
    console.error('Error fetching player game stats:', error);
    throw error;
  }
}

// Usage examples:
// Get all games
const allGames = await getPlayerGameStats(265, 11);

// Filter by season
const seasonGames = await getPlayerGameStats(265, 11, { seasonId: 2024 });

// Filter games with 25+ points
const highScoringGames = await getPlayerGameStats(265, 11, { 
  statType: 'TotalPoints', 
  overValue: 25 
});

// Filter by rebounds
const highReboundGames = await getPlayerGameStats(265, 11, { 
  statType: 'TotalRebounds', 
  overValue: 10 
});
```

### React Hook Examples

**1. For aggregated statistics:**
```javascript
import { useState, useEffect } from 'react';

function usePlayerStats(playerId, teamId) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/players/statistics?playerId=${playerId}&queryType=vs-team&enemyTeamId=${teamId}`
        );
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (playerId && teamId) {
      fetchStats();
    }
  }, [playerId, teamId]);

  return { stats, loading, error };
}
```

**2. For game-by-game statistics with filters:**
```javascript
import { useState, useEffect } from 'react';

function usePlayerGameStats(playerId, enemyTeamId, filters = {}) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGameStats() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          playerId: playerId,
          enemyTeamId: enemyTeamId,
          ...filters
        });
        
        const response = await fetch(`/api/players/statistics/games?${params}`);
        const result = await response.json();
        setGames(result.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (playerId && enemyTeamId) {
      fetchGameStats();
    }
  }, [playerId, enemyTeamId, JSON.stringify(filters)]);

  return { games, loading, error };
}

// Usage in component:
function PlayerGameTable({ playerId, enemyTeamId }) {
  const [filters, setFilters] = useState({});
  const { games, loading, error } = usePlayerGameStats(playerId, enemyTeamId, filters);

  const handleSeasonFilter = (seasonId) => {
    setFilters(prev => ({ ...prev, seasonId }));
  };

  const handlePointsFilter = (overValue) => {
    setFilters(prev => ({ 
      ...prev, 
      statType: 'TotalPoints', 
      overValue: overValue 
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>
        <button onClick={() => handleSeasonFilter(2024)}>2024 Season</button>
        <button onClick={() => handlePointsFilter(25)}>25+ Points</button>
        <button onClick={() => setFilters({})}>Clear Filters</button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Points</th>
            <th>Rebounds</th>
            <th>Assists</th>
            <th>Arena</th>
          </tr>
        </thead>
        <tbody>
          {games.map(game => (
            <tr key={game.GameId}>
              <td>{new Date(game.GameDate).toLocaleDateString()}</td>
              <td>{game.TotalPoints}</td>
              <td>{game.TotalRebounds}</td>
              <td>{game.Assists}</td>
              <td>{game.Arena}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 📝 Notes for Frontend Developers

1. **Photo URLs**: Player photos are stored as relative paths (e.g., `/src/assets/players/lebron_james.jpg`). You'll need to serve these from your frontend assets.

2. **Error Handling**: Always implement proper error handling for API calls. The API returns structured error responses.

3. **Caching**: Consider implementing caching for frequently accessed data like player and team lists.

4. **Pagination**: For large datasets, use the `limit` parameter to implement pagination.

5. **Real-time Updates**: The `LastUpdated` field can help you determine if data has changed and needs refreshing.

6. **Performance**: Use the `fields` parameter to request only the data you need, reducing payload size.

7. **Season Filtering**: Use `seasonId` to filter data by specific seasons.

---

## 🔧 Development Tips

- Use the `/health` endpoint to verify API connectivity
- Check the `/api/players/statistics/query-types` endpoint to understand available query options
- All endpoints return JSON responses
- Error responses include descriptive error messages
- The API uses standard HTTP status codes (200, 400, 404, 500)
