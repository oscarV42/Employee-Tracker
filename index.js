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
  
// New department prompt
const department = [
    {
        type: 'input',
        message: 'Please enter the name of the department:',
        name: 'department_name'  
    }
]

// Prompts user about new role
// Inserts that data into the database
const rolePrompt = (Departments) => {

    const insertNewRole = (title, salary, id) => {
        const sql = `INSERT INTO roles (role_title, role_salary, department_Id)
        VALUES ("${title}", "${salary}", "${id}")`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error(err)
                return;
            }
        console.log('Successfully added role to database!')
        });
        init();
    }

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
        message: 'Please select department this role belongs to:',
        name: 'department',
        choices: Departments,
    },
    ]).then((roleData) => {
        const role_title = roleData.role_name;
        const salary = roleData.role_salary;
        const department = roleData.department;

        db.query(`SELECT id FROM departments 
        WHERE department_name = ?`, department, (err, result) => {
            if(err){
                console.error(err);
                return;
            }
            const department_id = result[0].id
            insertNewRole(role_title, salary, department_id);
        });
    })
}
// Create new emplyee prmopts and inserting proper data 
// for new employee in the database
const employeePrompt = (roles, Mngers) => {

    const insertNewEmployee = (firstN, lastN, role_id, Mnger_id) => {
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
        ("${firstN}", "${lastN}", "${role_id}", "${Mnger_id}")`
        db.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return;
            }
            console.log('Empolyee added to the database!');
        });
        init();
    }

    inquirer.prompt([
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
        type: 'list',
        message: `Please select the employee's role:`,
        name: 'role',
        choices: roles
    },
    {
        type: 'list',
        message: `Please select the employee's manager:`,
        name: 'manager_name',
        choices: Mngers
    },
    ]).then((newEmpData) => {
        const firstName = newEmpData.first_name;
        const lastName = newEmpData.last_name;

        db.query(`SELECT id FROM employees WHERE concat(first_name," ", last_name)
        = ("${newEmpData.manager_name}")`, (err, result) => {
            if(err){
                console.log(err);
                return;
            }
            const manager_id = result[0].id;

            db.query(`SELECT id FROM roles WHERE role_title = ("${newEmpData.role}")`,
            (err, result) => {
                if (err){
                    console.log(err);
                    return;
                }
                const role_id = result[0].id

                insertNewEmployee(firstName, lastName, role_id, manager_id)
            })
        })
    })
}


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
            createNewRole();
            break;
        case 'Add an employee':
             createNewEmployee();
            break;
        case 'Update an employee role':
            getEmployeesAndRoles();
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

  // Create a department
function addNewDept(newDept) {
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

  // Create a role
function createNewRole() {
    var query =
      `SELECT id , department_name FROM departments`
    db.query(query, function (err, result) {
      if (err) {
        console.log('Error while fetching department data');
        return;
      }
      const depts = [];
      for (let index = 0; index < result.length; index++) {
        depts.push(result[index].department_name);
      }
      rolePrompt(depts)
    })
}
  
    // Read all employees
function viewEmployees() {
      const sql = `SELECT * FROM employees`;
        
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err)
          return;
        }
        console.table(result);
        init();
      });
}

// Getting list of employees that are possible managers and 
// roles from the databse
function createNewEmployee() {
    const sql = "SELECT department_Id, role_title FROM roles";
    const sql2 = "SELECT id, first_name, last_name FROM employees"

    db.query(sql, (err, result) => {
        if(err){
            console.log(err)
            return;
        }
        const roles = [];
        for(var i = 0; i < result.length; i++){
            roles.push(result[i].role_title);
        }
        
        const Mngers = ['None'];
        db.query(sql2, (err, result) => {
            if(err){
                console.log(err);
                return;
            }
            for(var i = 0; i < result.length; i++){
                Mngers.push(`${result[i].first_name} ${result[i].last_name}`)
            }
            employeePrompt(roles, Mngers);
        })
    })
}

function getEmployeesAndRoles() {
    db.query(`SELECT role_title from roles`, (err, result) => {
        if(err){
            console.log(err);
            return;
        }
        const roles = [];
        for(var i = 0; i < result.length; i++){
            roles.push(result[i].role_title);
        }

        db.query(`SELECT first_name, last_name FROM employees`, (err, result) => {
            if(err){
                console.log(err);
            }
            const emplyees = [];
        })
    })
}

// Function call to initialize app
init();