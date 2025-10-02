const { getPool } = require("../config/database");

async function createErrorLog(errorData) {
  const query = `
    INSERT INTO ErrorLog (
      Error, 
      FileName, 
      RecordCount, 
      StackTrace, 
      RequestData, 
      UserId, 
      Severity, 
      CreatedAt
    ) 
    VALUES (
      @error, 
      @fileName, 
      @recordCount, 
      @stackTrace, 
      @requestData, 
      @userId, 
      @severity, 
      @createdAt
    )
  `;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('error', errorData.error)
      .input('fileName', errorData.fileName)
      .input('recordCount', errorData.recordCount || null)
      .input('stackTrace', errorData.stackTrace || null)
      .input('requestData', errorData.requestData || null)
      .input('userId', errorData.userId || null)
      .input('severity', errorData.severity || 'ERROR')
      .input('createdAt', new Date())
      .query(query);
    
    return result.recordset;
  } catch (error) {
    console.error('Error creating error log:', error);
    throw error;
  }
}

async function getAllErrorLogs() {
  const query = `
    SELECT 
      Id,
      Error,
      FileName,
      RecordCount,
      StackTrace,
      RequestData,
      UserId,
      Severity,
      CreatedAt,
      UpdatedAt
    FROM ErrorLog 
    WHERE Active = 1
    ORDER BY CreatedAt DESC
  `;
  
  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all error logs:', error);
    throw error;
  }
}

async function getErrorLogById(id) {
  const query = `
    SELECT 
      Id,
      Error,
      FileName,
      RecordCount,
      StackTrace,
      RequestData,
      UserId,
      Severity,
      CreatedAt,
      UpdatedAt
    FROM ErrorLog 
    WHERE Id = @id AND Active = 1
  `;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting error log by id:', error);
    throw error;
  }
}

async function getErrorLogsByFileName(fileName) {
  const query = `
    SELECT 
      Id,
      Error,
      FileName,
      RecordCount,
      StackTrace,
      RequestData,
      UserId,
      Severity,
      CreatedAt,
      UpdatedAt
    FROM ErrorLog 
    WHERE FileName = @fileName AND Active = 1
    ORDER BY CreatedAt DESC
  `;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('fileName', fileName)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting error logs by file name:', error);
    throw error;
  }
}

async function getErrorLogsBySeverity(severity) {
  const query = `
    SELECT 
      Id,
      Error,
      FileName,
      RecordCount,
      StackTrace,
      RequestData,
      UserId,
      Severity,
      CreatedAt,
      UpdatedAt
    FROM ErrorLog 
    WHERE Severity = @severity AND Active = 1
    ORDER BY CreatedAt DESC
  `;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('severity', severity)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting error logs by severity:', error);
    throw error;
  }
}

async function deleteErrorLog(id) {
  const query = `
    UPDATE ErrorLog 
    SET Active = 0, UpdatedAt = @updatedAt
    WHERE Id = @id
  `;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .input('updatedAt', new Date())
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error deleting error log:', error);
    throw error;
  }
}

module.exports = {
  createErrorLog,
  getAllErrorLogs,
  getErrorLogById,
  getErrorLogsByFileName,
  getErrorLogsBySeverity,
  deleteErrorLog
};
