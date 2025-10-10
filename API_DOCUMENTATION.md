# MyProps Backend API Documentation

## Overview
This documentation provides comprehensive information about the MyProps Backend API endpoints, with special focus on the `getPlayerVsTeamStatistics` endpoint and basic CRUD operations for players and teams.

**Base URL:** `http://localhost:3000/api` (or your deployed server URL)

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
