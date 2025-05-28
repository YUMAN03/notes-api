const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'notesdb',
  password: 'cc@codegeass',
  port: 5432,
});

module.exports = pool;
