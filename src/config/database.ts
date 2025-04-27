import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'srv811.hstgr.io',
  user: 'u339198693_sistemacorp',
  password: '',
  database: 'u339198693_sistemacorp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  supportBigNumbers: true,
  bigNumberStrings: true,
  charset: 'utf8mb4',
});

export default pool;
