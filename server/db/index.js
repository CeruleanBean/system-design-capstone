require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB_NAME,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD
});

module.exports = db;
