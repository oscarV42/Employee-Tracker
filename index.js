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
const rolePrompt = (Departments) => {
    inquirer.prompt([
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
        type: 'list',
        message: 'Please select department this role belongs to',
        name: 'department_id',
        choices: Departments,
        },
    ]).then((roleData) => {
        let role_title = answer.role_name;
        let salary = answer.role_salary;
        let department = answer.department_id;

        db.query(`SELECT id FROM department 
        WHERE name = ('${department}')`), (err, result) => {
            if(err){
                console.error(err);
            }
            const department_id = result.id;
        }
    })
}
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
            viewDepts();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
            break;
        case 'Add a department':
            inquirer.prompt(department)
            .then((answer) => {
                addNewDept(answer.department_name)
            })
            break;
        case 'Add a role':
            inquirer.prompt(role)
            .then((answer) => {
                createNewRole(answer)
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
                db.end();
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
  function viewDepts() {
    const sql = `SELECT * FROM departments`; 
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      console.table(rows);
      init();
    });

}
function addNewDept(newDept) {
  // Create a department
    const sql = `INSERT INTO departments (department_name)
      VALUE (?)`;
    const params = [newDept];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error(err)
        return;
      }
      console.log('Successfully added department to database!')
      init();
    });
}
  
    // Read all roles
function viewRoles(){
    const sql = `SELECT * FROM roles`;
      
    db.query(sql, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      console.table(result)
      init();
    });
}

function createNewRole(newRole) {
  // Create a role
  const getDepts = () => {
    var query =
      `SELECT id , name FROM department`
    db.query(query, function (err, result) {
      if (err) {
        console.log('Error while fetching department data');
        return;
      }
      const depts = [];
      for (let index = 0; index < res.length; index++) {
        depts.push(result[index].name);
      }
      rolePrompt(depts)
    })
    }
    // const sql = `INSERT INTO roles (role_title) (role_salary) (department_Id)
    //   VALUES (?)`;
    // const params = [newRole.role_name, newRole.role_salary, newRole.department_id];
  
    // db.query(sql, params, (err, result) => {
    //   if (err) {
    //     console.error(err)
    //     return;
    //   }
    //   console.log('Successfully added role to database!')
    // });

}
  
    // Read all employees
function viewEmployees() {
      const sql = `SELECT * FROM employees`;
        
      db.query(sql, (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        console.table(result);
        init();
      });
}
// Function call to initialize app
init();