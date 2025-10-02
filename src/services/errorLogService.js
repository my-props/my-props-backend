const errorLogRepository = require("../repositories/errorLogRepository");

async function logError(errorData) {
    try {
        // Validate required fields
        if (!errorData.error) {
            throw new Error("Error message is required");
        }
        if (!errorData.fileName) {
            throw new Error("File name is required");
        }

        // Prepare error data with defaults
        const logData = {
            error: errorData.error,
            fileName: errorData.fileName,
            recordCount: errorData.recordCount || null,
            stackTrace: errorData.stackTrace || null,
            requestData: errorData.requestData || null,
            userId: errorData.userId || null,
            severity: errorData.severity || 'ERROR'
        };

        const result = await errorLogRepository.createErrorLog(logData);
        return result;
    } catch (error) {
        console.error('Error in errorLogService.logError:', error);
        throw error;
    }
}

async function logDatabaseError(error, fileName, recordCount = null, requestData = null) {
    try {
        const errorData = {
            error: error.message || error.toString(),
            fileName: fileName,
            recordCount: recordCount,
            stackTrace: error.stack || null,
            requestData: requestData ? JSON.stringify(requestData) : null,
            severity: 'DATABASE_ERROR'
        };

        return await logError(errorData);
    } catch (logError) {
        console.error('Failed to log database error:', logError);
        // Don't throw here to avoid infinite loops
    }
}

async function logServiceError(error, fileName, recordCount = null, requestData = null) {
    try {
        const errorData = {
            error: error.message || error.toString(),
            fileName: fileName,
            recordCount: recordCount,
            stackTrace: error.stack || null,
            requestData: requestData ? JSON.stringify(requestData) : null,
            severity: 'SERVICE_ERROR'
        };

        return await logError(errorData);
    } catch (logError) {
        console.error('Failed to log service error:', logError);
        // Don't throw here to avoid infinite loops
    }
}

async function logRouteError(error, fileName, requestData = null) {
    try {
        const errorData = {
            error: error.message || error.toString(),
            fileName: fileName,
            recordCount: null,
            stackTrace: error.stack || null,
            requestData: requestData ? JSON.stringify(requestData) : null,
            severity: 'ROUTE_ERROR'
        };

        return await logError(errorData);
    } catch (logError) {
        console.error('Failed to log route error:', logError);
        // Don't throw here to avoid infinite loops
    }
}

async function getAllErrorLogs() {
    try {
        const errorLogs = await errorLogRepository.getAllErrorLogs();
        return errorLogs;
    } catch (error) {
        console.error('Error in errorLogService.getAllErrorLogs:', error);
        throw error;
    }
}

async function getErrorLogById(id) {
    try {
        if (!id) {
            throw new Error("Error log ID is required");
        }

        const errorLog = await errorLogRepository.getErrorLogById(id);
        
        if (!errorLog) {
            throw new Error("Error log not found");
        }

        return errorLog;
    } catch (error) {
        console.error('Error in errorLogService.getErrorLogById:', error);
        throw error;
    }
}

async function getErrorLogsByFileName(fileName) {
    try {
        if (!fileName) {
            throw new Error("File name is required");
        }

        const errorLogs = await errorLogRepository.getErrorLogsByFileName(fileName);
        return errorLogs;
    } catch (error) {
        console.error('Error in errorLogService.getErrorLogsByFileName:', error);
        throw error;
    }
}

async function getErrorLogsBySeverity(severity) {
    try {
        if (!severity) {
            throw new Error("Severity is required");
        }

        const errorLogs = await errorLogRepository.getErrorLogsBySeverity(severity);
        return errorLogs;
    } catch (error) {
        console.error('Error in errorLogService.getErrorLogsBySeverity:', error);
        throw error;
    }
}

async function deleteErrorLog(id) {
    try {
        if (!id) {
            throw new Error("Error log ID is required");
        }

        const result = await errorLogRepository.deleteErrorLog(id);
        return result;
    } catch (error) {
        console.error('Error in errorLogService.deleteErrorLog:', error);
        throw error;
    }
}

module.exports = {
    logError,
    logDatabaseError,
    logServiceError,
    logRouteError,
    getAllErrorLogs,
    getErrorLogById,
    getErrorLogsByFileName,
    getErrorLogsBySeverity,
    deleteErrorLog
};
