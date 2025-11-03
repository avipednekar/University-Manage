import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost',
  database: 'college', // Your database name
  password: 'student', // Your password
  port: 5432,
});

export default pool;