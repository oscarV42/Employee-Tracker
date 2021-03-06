const inquirer = require('inquirer');
// Import and require mysql2
require('dotenv').config();

// Connect to database
const db = require('./server/server')
  
// New department prompt
const department = () => {

    inquirer.prompt([
    {
        type: 'input',
        message: 'Please enter the name of the department:',
        name: 'department_name',
        validate: answer => {
            if(answer !== "") {
                return true;
            }
            return 'Please enter at leat one character!';
        }
    }
    ]).then((data) => {
        addNewDept(data.department_name);
    })
}

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
        init();
        });
    }

    inquirer.prompt([
    {
        type: 'input',
        message: 'Please enter role name:',
        name: 'role_name',
        validate: answer => {
            if(answer !== "") {
                return true;
            }
            return 'Please enter at leat one character!';
        }
    },
    {
        type: 'input',
        message: 'Enter salary:',
        name: 'role_salary',
        validate: answer => {
            const pass = answer.match(/^[1-9]\d*$/);
            if(pass){
                return true;
            }
            return "Please enter a positive number greater than zero.";
        }
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

        const insert = (sql) => {
            db.query(sql, (err, result) => {
            if(err){
                console.log(err);
                return;
            }
            console.log('Empolyee added to the database!');
            init();
            });
        }  
 
        const sql2 = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
        ("${firstN}", "${lastN}", "${role_id}", NULL)`
    
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
        ("${firstN}", "${lastN}", "${role_id}", "${Mnger_id}")`
        
        if(Mnger_id === ''){
            insert(sql2)
        }else{
            insert(sql)  
        }
    }

    inquirer.prompt([
    {
        type: 'input',
        message: `Enter the employee's first name:`,
        name: 'first_name',
        validate: answer => {
            if(answer !== "") {
                return true;
            }
            return 'Please enter at leat one character!';
        }
    },
    {
        type: 'input',
        message: `Enter the employees last name:`,
        name: 'last_name',
        validate: answer => {
            if(answer !== "") {
                return true;
            }
            return 'Please enter at leat one character!';
        }
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

        if(newEmpData.manager_name !== "None"){
            db.query(`SELECT id FROM employees WHERE concat(first_name," ", last_name)
            = ("${newEmpData.manager_name}")`, (err, result) => {
                if(err){
                    console.log(err);
                    return;
                }
                manager_id = result[0].id;
            })
        }   

        manager_id = '';

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
}

// function that handles updating the database with given data chosen by the user
const updateEmplyeePrompt = (roles, employees) => {
    inquirer.prompt([
        {
          type: "list",
          name: "employeeName",
          message: "Which employee do you want to change the role? ",
          choices: employees,
        },
        {
          type: "list",
          name: "employeeRole",
          message: "Please select a new role:",
          choices: roles
        }
      ]).then((data) => {
        const employeeName = data.employeeName;
        const newRole = data.employeeRole;

        db.query(`SELECT id FROM roles WHERE role_title = ("${newRole}")`, (err, result) =>{
            if(err){
                console.log(err);
                return;
            }
            const role_id = result[0].id;

            db.query(`SELECT id FROM employees WHERE concat(first_name, " ", last_name) = 
            ("${employeeName}")`, (err, result) => {
                if(err){
                    console.log(err);
                }
                const employeeId = result[0].id;

                db.query(`UPDATE employees SET role_id = ("${role_id}") WHERE id = ("${employeeId}")`,
                (err, result) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(`Employee ${employeeId} successfully updated!`)
                    init();
                })
            })
        })
      })
}

// function that handles what the user wants to do after they answer the initial prompt
function choice_handler(answer){
    switch(answer) {
        case 'View all departments': viewDepts();
            break;
        case 'View all roles': viewRoles();
            break;
        case 'View all employees': viewEmployees();
            break;
        case 'Add a department': department();
            break;
        case 'Add a role': getDepartmentName();
            break;
        case 'Add an employee': getRoleandName();
            break;
        case 'Update an employee role': getEmployeesAndRoles();
            break; 
            default: db.end();
                break;
    }   
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
function getDepartmentName() {
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
function getRoleandName() {
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

// function to get Employees and roles from database
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
            const employees = [];
            for(var i = 0; i < result.length; i++){
                employees.push(result[i].first_name + " " + result[i].last_name)
            }
            updateEmplyeePrompt(roles, employees);
        })
    })
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

// Function call to initialize app
init();