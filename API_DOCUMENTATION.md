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
```

### React Hook Example

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
