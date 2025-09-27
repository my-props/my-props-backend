require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test database connection on startup
async function testConnection() {
  try {
    console.log("🔄 Attempting to connect to database...");
    console.log(`📍 Host: ${process.env.DB_HOST}`);
    console.log(`🗄️  Database: ${process.env.DB_NAME}`);
    console.log(`👤 User: ${process.env.DB_USER}`);
    console.log(`🔌 Port: ${process.env.DB_PORT}`);

    const client = await pool.connect();
    console.log("✅ Database connection successful!");

    // Test query to verify connection
    const result = await client.query('SELECT NOW() as current_time, version() as db_version');
    console.log("📊 Database Info:");
    console.log(`   Current Time: ${result.rows[0].current_time}`);
    console.log(`   Database Version: ${result.rows[0].db_version}`);

    client.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Detail: ${error.detail || 'No additional details'}`);
    return false;
  }
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('💥 Unexpected error on idle client:', err);
  process.exit(-1);
});

// Test connection when module is loaded
testConnection().then((success) => {
  if (success) {
    console.log("🚀 Database module loaded successfully!");
  } else {
    console.log("⚠️  Database module loaded with connection issues!");
  }
});

module.exports = pool;
