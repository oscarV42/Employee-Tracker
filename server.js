const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
console.log(require('dotenv').config());

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      // TODO: Add MySQL password here
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    console.log(`Connected to the  database.`)
  );
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  