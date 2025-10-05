const app = require('./app');
const { getPool } = require('./config/database');

const PORT = process.env.PORT || 3000;

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

    // Close database connections
    getPool().then(pool => {
        pool.close(() => {
            console.log('📊 Database connections closed');
            process.exit(0);
        });
    }).catch(err => {
        console.error('❌ Error closing database connections:', err);
        process.exit(1);
    });
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
});

// Start server
const server = app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 MyProps Backend Server Started!');
    console.log('='.repeat(60));
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 API endpoints: http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(60));
});

// Export server for testing
module.exports = server;
