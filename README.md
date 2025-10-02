# My Props Backend API

A Node.js backend API for managing sports statistics, games, and team data. This API provides comprehensive endpoints for retrieving team statistics, game data, and player information.

## 🚀 Quick Start

**Base URL:** `http://localhost:3000/api`

**Health Check:** `http://localhost:3000/health`

## 📚 API Endpoints

### 🏥 Health Check
- **GET** `/health` - Check if the server is running
  - **Response:** Server status and timestamp

---

### 👥 User Management
- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - User login
- **GET** `/api/users/:email` - Get user by email

---

### 🏀 Team Statistics

#### Get All Team Statistics
- **GET** `/api/team-stats`
  - **Description:** Retrieve all team statistics
  - **Response:** Array of team statistics with all fields

#### Get Team Statistics by ID
- **GET** `/api/team-stats/:id`
  - **Description:** Get specific team statistics by ID
  - **Parameters:** `id` (team stats ID)
  - **Response:** Single team statistics object

#### Get Team Statistics by Team ID
- **GET** `/api/teams/:teamId/team-stats`
  - **Description:** Get all statistics for a specific team
  - **Parameters:** `teamId` (team ID)
  - **Response:** Array of team statistics for the specified team

#### Get Team Statistics by Season
- **GET** `/api/seasons/:seasonId/team-stats`
  - **Description:** Get team statistics for a specific season
  - **Parameters:** `seasonId` (season ID)
  - **Response:** Array of team statistics for the specified season

#### Get Team Statistics by Game
- **GET** `/api/games/:gameId/team-stats`
  - **Description:** Get team statistics for a specific game
  - **Parameters:** `gameId` (game ID)
  - **Response:** Array of team statistics for the specified game

---

### 📊 Team Statistics Aggregation

#### Get Team Statistics Sum (Single Team)
- **GET** `/api/teams/:teamId/stats/sum`
  - **Description:** Get aggregated statistics for a single team
  - **Parameters:** `teamId` (team ID)
  - **Response:** 
    ```json
    {
      "TeamId": 1,
      "TotalPointsSum": 2500,
      "GameCount": 10,
      "AveragePoints": 250.0,
      "MaxPoints": 300,
      "MinPoints": 200,
      "MedianTotalPoints": 245.0,
      "MedianFastBreakPoints": 12.0,
      "MedianPointsInPaint": 42.0,
      "MedianSecondChancePoints": 8.0,
      "MedianPointsOffTurnovers": 15.0,
      "MedianFieldGoalsMade": 35.0,
      "MedianFieldGoalsAttempted": 78.0,
      "MedianFreeThrowsMade": 18.0,
      "MedianFreeThrowsAttempted": 22.0,
      "MedianThreePointShotsMade": 7.0,
      "MedianThreePointShotsAttempted": 25.0,
      "MedianOffensiveRebounds": 12.0,
      "MedianDefensiveRebounds": 28.0,
      "MedianTotalRebounds": 40.0,
      "MedianAssists": 22.0,
      "MedianPersonalFouls": 18.0,
      "MedianSteals": 8.0,
      "MedianTurnovers": 14.0,
      "MedianBlocks": 4.0
    }
    ```

#### Get Team Statistics Sum (Multiple Teams)
- **GET** `/api/teams/stats/sum?teamIds=1,7,3`
  - **Description:** Get aggregated statistics for multiple teams
  - **Query Parameters:** `teamIds` (comma-separated team IDs)
  - **Response:** Array of team statistics objects (same format as single team)

---

### 🎮 Game Statistics

#### Get Game Statistics by Teams and Game
- **GET** `/api/games/:gameId/teams/stats?teamIds=1,7`
  - **Description:** Get detailed game statistics for specific teams in a specific game
  - **Parameters:** 
    - `gameId` (game ID)
    - `teamIds` (comma-separated team IDs in query parameter)
  - **Response:**
    ```json
    [
      {
        "GameId": 17,
        "TeamId": 1,
        "TotalPoints": 95,
        "FastBreakPoints": 12,
        "PointsInPaint": 42,
        "SecondChancePoints": 8,
        "PointsOffTurnovers": 15,
        "FieldGoalsMade": 35,
        "FieldGoalsAttempted": 78,
        "FreeThrowsMade": 18,
        "FreeThrowsAttempted": 22,
        "ThreePointShotsMade": 7,
        "ThreePointShotsAttempted": 25,
        "OffensiveRebounds": 12,
        "DefensiveRebounds": 28,
        "TotalRebounds": 40,
        "Assists": 22,
        "PersonalFouls": 18,
        "Steals": 8,
        "Turnovers": 14,
        "Blocks": 4,
        "BiggestLead": 15,
        "LongestRun": 8
      }
    ]
    ```

#### Get Team Statistics Against All Opponents
- **GET** `/api/teams/:teamId/opponents/stats`
  - **Description:** Get team statistics against all opponents they've played
  - **Parameters:** `teamId` (team ID)
  - **Response:** Array of game statistics with opponent information
    ```json
    [
      {
        "TeamId": 1,
        "GameId": 17,
        "TeamHomeId": 1,
        "TeamVisitorId": 7,
        "OpponentTeamId": 7,
        "TotalPoints": 95,
        "FastBreakPoints": 12,
        "PointsInPaint": 42,
        "SecondChancePoints": 8,
        "PointsOffTurnovers": 15,
        "FieldGoalsMade": 35,
        "FieldGoalsAttempted": 78,
        "FreeThrowsMade": 18,
        "FreeThrowsAttempted": 22,
        "ThreePointShotsMade": 7,
        "ThreePointShotsAttempted": 25,
        "OffensiveRebounds": 12,
        "DefensiveRebounds": 28,
        "TotalRebounds": 40,
        "Assists": 22,
        "PersonalFouls": 18,
        "Steals": 8,
        "Turnovers": 14,
        "Blocks": 4,
        "BiggestLead": 15,
        "LongestRun": 8,
        "OpponentTeamName": "Lakers",
        "OpponentTeamNickName": "LAL"
      }
    ]
    ```

---

## 🧪 Postman Collection Examples

### Example 1: Get Team Statistics for Teams 1 and 7
```
GET http://localhost:3000/api/teams/stats/sum?teamIds=1,7
```

### Example 2: Get Game Statistics for Teams 1 and 7 in Game 17
```
GET http://localhost:3000/api/games/17/teams/stats?teamIds=1,7
```

### Example 3: Get Team 1's Performance Against All Opponents
```
GET http://localhost:3000/api/teams/1/opponents/stats
```

### Example 4: Get Team 1's Aggregated Statistics
```
GET http://localhost:3000/api/teams/1/stats/sum
```

---

## 📋 Response Status Codes

- **200** - Success
- **400** - Bad Request (invalid parameters or data)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error

---

## 🔧 Error Response Format

```json
{
  "error": "Error message description"
}
```

---

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Test the health endpoint:**
   ```
   GET http://localhost:3000/health
   ```

3. **Import these endpoints into Postman:**
   - Create a new collection
   - Add each endpoint as a new request
   - Use the base URL: `http://localhost:3000/api`

---

## 📊 Available Statistics Fields

- **TotalPoints** - Total points scored
- **FastBreakPoints** - Points from fast breaks
- **PointsInPaint** - Points scored in the paint
- **SecondChancePoints** - Points from second chance opportunities
- **PointsOffTurnovers** - Points scored off opponent turnovers
- **FieldGoalsMade/Attempted** - Field goal statistics
- **FreeThrowsMade/Attempted** - Free throw statistics
- **ThreePointShotsMade/Attempted** - Three-point shot statistics
- **OffensiveRebounds** - Offensive rebounds
- **DefensiveRebounds** - Defensive rebounds
- **TotalRebounds** - Total rebounds
- **Assists** - Assists
- **PersonalFouls** - Personal fouls
- **Steals** - Steals
- **Turnovers** - Turnovers
- **Blocks** - Blocks
- **BiggestLead** - Biggest lead in the game
- **LongestRun** - Longest scoring run

---

## 🎯 Quick Test Examples

**Test Team Statistics:**
```
GET http://localhost:3000/api/teams/stats/sum?teamIds=1,7
```

**Test Game Statistics:**
```
GET http://localhost:3000/api/games/17/teams/stats?teamIds=1,7
```

**Test Health Check:**
```
GET http://localhost:3000/health
```

All endpoints return JSON responses and include comprehensive error handling with detailed error messages.