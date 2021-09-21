// Import and require mysql2
const mysql = require('mysql2');
require('dotenv').config();

// Connect to database
module.exports = db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    console.log(`Connected to the database.`)
  );
