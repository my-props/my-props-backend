const sql = require("mssql")
require("dotenv").config()
console.log("User: " + process.env.DB_USER)
console.log("Db Pass : " + process.env.DB_PASS)
console.log("Host: " + process.env.DB_HOST)
console.log("Port: " + process.env.DB_PORT)
console.log("Database: " + process.env.DB_NAME)

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

let pool

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config)
    console.log("SQL connection pool created")
  }
  return pool
}

module.exports = { getPool }
