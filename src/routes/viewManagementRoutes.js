const express = require("express");
const router = express.Router();
const viewManagementService = require("../services/viewManagementService");
const errorLogService = require("../services/errorLogService");

// Refresh all materialized views
router.post("/refresh-all", async (req, res) => {
  try {
    const result = await viewManagementService.refreshAllViews();
    res.status(200).json({
      success: true,
      message: "All materialized views refreshed successfully",
      data: result
    });
  } catch (error) {
    await errorLogService.logRouteError(error, 'viewManagementRoutes.js', { route: '/refresh-all', method: 'POST' });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Refresh specific view
router.post("/refresh/:viewName", async (req, res) => {
  try {
    const { viewName } = req.params;
    let result;

    switch (viewName.toLowerCase()) {
      case 'playervsteamstats':
        result = await viewManagementService.refreshPlayerVsTeamStats();
        break;
      case 'playerpositionstats':
        result = await viewManagementService.refreshPlayerPositionStats();
        break;
      case 'playervspositionstats':
        result = await viewManagementService.refreshPlayerVsPositionStats();
        break;
      case 'playervsplayerstats':
        result = await viewManagementService.refreshPlayerVsPlayerStats();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Invalid view name. Valid options: playervsteamstats, playerpositionstats, playervspositionstats, playervsplayerstats"
        });
    }

    res.status(200).json({
      success: true,
      message: `${viewName} refreshed successfully`,
      data: result
    });
  } catch (error) {
    await errorLogService.logRouteError(error, 'viewManagementRoutes.js', { route: '/refresh/:viewName', method: 'POST', viewName: req.params.viewName });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Refresh views for specific season
router.post("/refresh-season/:seasonId", async (req, res) => {
  try {
    const { seasonId } = req.params;
    const seasonIdNum = parseInt(seasonId);

    if (isNaN(seasonIdNum)) {
      return res.status(400).json({
        success: false,
        error: "Invalid season ID. Must be a number."
      });
    }

    const result = await viewManagementService.refreshViewsForSeason(seasonIdNum);
    res.status(200).json({
      success: true,
      message: `Views refreshed for season ${seasonIdNum} successfully`,
      data: result
    });
  } catch (error) {
    await errorLogService.logRouteError(error, 'viewManagementRoutes.js', { route: '/refresh-season/:seasonId', method: 'POST', seasonId: req.params.seasonId });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get refresh log
router.get("/refresh-log", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;

    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return res.status(400).json({
        success: false,
        error: "Invalid limit. Must be a number between 1 and 1000."
      });
    }

    const result = await viewManagementService.getRefreshLog(limit);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    await errorLogService.logRouteError(error, 'viewManagementRoutes.js', { route: '/refresh-log', method: 'GET', limit: req.query.limit });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get refresh log for specific view
router.get("/refresh-log/:viewName", async (req, res) => {
  try {
    const { viewName } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;

    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return res.status(400).json({
        success: false,
        error: "Invalid limit. Must be a number between 1 and 1000."
      });
    }

    const result = await viewManagementService.getRefreshLogByView(viewName, limit);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    await errorLogService.logRouteError(error, 'viewManagementRoutes.js', { route: '/refresh-log/:viewName', method: 'GET', viewName: req.params.viewName, limit: req.query.limit });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get view statistics
router.get("/statistics", async (req, res) => {
  try {
    const result = await viewManagementService.getViewStatistics();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    await errorLogService.logRouteError(error, 'viewManagementRoutes.js', { route: '/statistics', method: 'GET' });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check if views exist
router.get("/check-views", async (req, res) => {
  try {
    const result = await viewManagementService.checkViewsExist();
    res.status(200).json({
      success: true,
      data: result,
      message: `Found ${result.length} materialized views`
    });
  } catch (error) {
    await errorLogService.logRouteError(error, 'viewManagementRoutes.js', { route: '/check-views', method: 'GET' });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
