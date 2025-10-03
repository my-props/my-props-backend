const { getPool } = require("../config/database");
const errorLogService = require("./errorLogService");

/**
 * Service to manage materialized views refresh operations
 */
class ViewManagementService {
    
    /**
     * Refresh all materialized views
     */
    async refreshAllViews() {
        try {
            const pool = await getPool();
            const result = await pool.request().execute('RefreshAllMaterializedViews');
            
            console.log('All materialized views refreshed successfully');
            return {
                success: true,
                message: 'All materialized views refreshed successfully',
                result: result
            };
        } catch (error) {
            console.error('Error refreshing all views:', error);
            await errorLogService.logServiceError(error, 'viewManagementService.js', null, { function: 'refreshAllViews' });
            throw error;
        }
    }

    /**
     * Refresh PlayerVsTeamStats view
     */
    async refreshPlayerVsTeamStats() {
        try {
            const pool = await getPool();
            const result = await pool.request().execute('RefreshPlayerVsTeamStats');
            
            console.log('PlayerVsTeamStats refreshed successfully');
            return {
                success: true,
                message: 'PlayerVsTeamStats refreshed successfully',
                result: result
            };
        } catch (error) {
            console.error('Error refreshing PlayerVsTeamStats:', error);
            await errorLogService.logServiceError(error, 'viewManagementService.js', null, { function: 'refreshPlayerVsTeamStats' });
            throw error;
        }
    }

    /**
     * Refresh PlayerPositionStats view
     */
    async refreshPlayerPositionStats() {
        try {
            const pool = await getPool();
            const result = await pool.request().execute('RefreshPlayerPositionStats');
            
            console.log('PlayerPositionStats refreshed successfully');
            return {
                success: true,
                message: 'PlayerPositionStats refreshed successfully',
                result: result
            };
        } catch (error) {
            console.error('Error refreshing PlayerPositionStats:', error);
            await errorLogService.logServiceError(error, 'viewManagementService.js', null, { function: 'refreshPlayerPositionStats' });
            throw error;
        }
    }

    /**
     * Refresh PlayerVsPositionStats view
     */
    async refreshPlayerVsPositionStats() {
        try {
            const pool = await getPool();
            const result = await pool.request().execute('RefreshPlayerVsPositionStats');
            
            console.log('PlayerVsPositionStats refreshed successfully');
            return {
                success: true,
                message: 'PlayerVsPositionStats refreshed successfully',
                result: result
            };
        } catch (error) {
            console.error('Error refreshing PlayerVsPositionStats:', error);
            await errorLogService.logServiceError(error, 'viewManagementService.js', null, { function: 'refreshPlayerVsPositionStats' });
            throw error;
        }
    }

    /**
     * Refresh PlayerVsPlayerStats view
     */
    async refreshPlayerVsPlayerStats() {
        try {
            const pool = await getPool();
            const result = await pool.request().execute('RefreshPlayerVsPlayerStats');
            
            console.log('PlayerVsPlayerStats refreshed successfully');
            return {
                success: true,
                message: 'PlayerVsPlayerStats refreshed successfully',
                result: result
            };
        } catch (error) {
            console.error('Error refreshing PlayerVsPlayerStats:', error);
            await errorLogService.logServiceError(error, 'viewManagementService.js', null, { function: 'refreshPlayerVsPlayerStats' });
            throw error;
        }
    }

    /**
     * Refresh views for a specific season
     */
    async refreshViewsForSeason(seasonId) {
        try {
            if (!seasonId) {
                throw new Error("Season ID is required");
            }

            const pool = await getPool();
            const request = pool.request();
            request.input('seasonId', seasonId);
            const result = await request.execute('RefreshViewsForSeason');
            
            console.log(`Views refreshed for season ${seasonId} successfully`);
            return {
                success: true,
                message: `Views refreshed for season ${seasonId} successfully`,
                seasonId: seasonId,
                result: result
            };
        } catch (error) {
            console.error('Error refreshing views for season:', error);
            await errorLogService.logServiceError(error, 'viewManagementService.js', null, { function: 'refreshViewsForSeason', seasonId });
            throw error;
        }
    }

    /**
     * Get refresh log history
     */
    async getRefreshLog(limit = 50) {
        try {
            const pool = await getPool();
            const query = `
                SELECT TOP ${limit}
                    Id,
                    ViewName,
                    RefreshType,
                    StartTime,
                    EndTime,
                    Duration,
                    Status,
                    ErrorMessage,
                    CreatedAt
                FROM ViewRefreshLog
                ORDER BY StartTime DESC
            `;
            
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error getting refresh log:', error);
            await errorLogService.logServiceError(error, 'viewManagementService.js', null, { function: 'getRefreshLog', limit });
            throw error;
        }
    }

    /**
     * Get refresh log for a specific view
     */
    async getRefreshLogByView(viewName, limit = 20) {
        try {
            if (!viewName) {
                throw new Error("View name is required");
            }

            const pool = await getPool();
            const query = `
                SELECT TOP ${limit}
                    Id,
                    ViewName,
                    RefreshType,
                    StartTime,
                    EndTime,
                    Duration,
                    Status,
                    ErrorMessage,
                    CreatedAt
                FROM ViewRefreshLog
                WHERE ViewName = @viewName
                ORDER BY StartTime DESC
            `;
            
            const request = pool.request();
            request.input('viewName', viewName);
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error getting refresh log by view:', error);
            await errorLogService.logServiceError(error, 'viewManagementService.js', null, { function: 'getRefreshLogByView', viewName, limit });
            throw error;
        }
    }

    /**
     * Get view statistics
     */
    async getViewStatistics() {
        try {
            const pool = await getPool();
            const query = `
                SELECT 
                    ViewName,
                    COUNT(*) as TotalRefreshes,
                    SUM(CASE WHEN Status = 'SUCCESS' THEN 1 ELSE 0 END) as SuccessfulRefreshes,
                    SUM(CASE WHEN Status = 'ERROR' THEN 1 ELSE 0 END) as FailedRefreshes,
                    AVG(Duration) as AverageDuration,
                    MAX(StartTime) as LastRefresh,
                    MIN(StartTime) as FirstRefresh
                FROM ViewRefreshLog
                GROUP BY ViewName
                ORDER BY LastRefresh DESC
            `;
            
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error getting view statistics:', error);
            await errorLogService.logServiceError(error, 'viewManagementService.js', null, { function: 'getViewStatistics' });
            throw error;
        }
    }

    /**
     * Check if views exist
     */
    async checkViewsExist() {
        try {
            const pool = await getPool();
            const query = `
                SELECT 
                    TABLE_NAME as ViewName,
                    CREATE_DATE as CreatedDate
                FROM INFORMATION_SCHEMA.VIEWS
                WHERE TABLE_NAME IN (
                    'PlayerVsTeamStats',
                    'PlayerPositionStats', 
                    'PlayerVsPositionStats',
                    'PlayerVsPlayerStats'
                )
                ORDER BY TABLE_NAME
            `;
            
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error checking views exist:', error);
            await errorLogService.logServiceError(error, 'viewManagementService.js', null, { function: 'checkViewsExist' });
            throw error;
        }
    }
}

module.exports = new ViewManagementService();
