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
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    console.log(`Connected to the database.`)
  );
  
  // Read all departments
app.get('/api/departments', (req, res) => {
  const sql = `SELECT id, department_name AS title FROM departments`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});
  
// Create a department
app.post('/api/new-department', ({ body }, res) => {
  const sql = `INSERT INTO departments (department_name)
    VALUES (?)`;
  const params = [body.department_name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body,
    });
  });
});

  // Read all roles
app.get('/api/roles', (req, res) => {
  const sql = `SELECT id, role_name AS title FROM roles`;
    
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

