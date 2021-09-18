const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
require('dotenv').config();

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
  

const department = [
    {
        type: 'input',
        message: 'Please enter the name of the department:',
        name: 'department_name'  
    }
]
const role = [
    {
        type: 'input',
        message: 'Please enter role name:',
        name: 'role_name'
    },
    {
        type: 'input',
        message: 'Enter salary:',
        name: 'role_salary'
    },
    {
        type: 'input',
        message: 'Please enter department id:',
        name: 'department_id'
        },
]
const employee = [
    {
        type: 'input',
        message: `Enter the employee's first name:`,
        name: 'first_name'
    },
    {
        type: 'input',
        message: `Enter the employees last name:`,
        name: 'last_name'
    },
    {
        type: 'input',
        message: `Enter the employee's role id:`,
        name: 'role_id'
    },
    {
        type: 'input',
        message: `Enter the employee's manager id:`,
        name: 'manager_id'
    },
]


function choice_handler(answer){
    switch(answer) {
        case 'View all departments':
            getDepartments();
            break;
        case 'View all roles':
            break;
        case 'View all employees':
            break;
        case 'Add a department':
            inquirer.prompt(department)
            .then((answer) => {
                console.log(answer.department_name)
            })
            break;
        case 'Add a role':
            inquirer.prompt(role)
            .then((answer) => {
                console.log(answer)
            })
            break;
        case 'Add an employee':
            inquirer.prompt(employee)
            .then((answer) => {
                console.log(answer)
            })
            break;
        case 'Update an employee role':
            break; 
            default:
                break;
    }   
}

// Function to initialize app
function init() {
    inquirer
    .prompt([
        {
         type: 'list',
         message: 'What wpuld ypu like to do?',
         name: 'init',
         choices: ['View all departments', 
         'View all roles', 
         'View all employees', 
         'Add a department', 
         'Add a role', 
         'Add an employee', 
         'Update an employee role',
         'Quit']
        }
    ])
    .then((data) => {
        choice_handler(data.init);
    });
    
}

  // Read all departments
  app.get('/api/departments', (req, res) => {
    const sql = `SELECT * FROM departments`;
    
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
    const sql = `SELECT * FROM roles`;
      
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
  
  // Create a role
  app.post('/api/new-role', ({ body }, res) => {
    const sql = `INSERT INTO roles (role_name) (role_salary) (department_id)
      VALUES (?)`;
    const params = [body.role_name, body.role_salary, body.department_id];
  
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
  
    // Read all employees
    app.get('/api/employees', (req, res) => {
      const sql = `SELECT * FROM departments`;
        
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

// Function call to initialize app
init();