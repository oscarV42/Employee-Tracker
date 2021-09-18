const inquirer = require('inquirer');
const server = require('./server/server.js')
const REQUEST = require('./REQUEST/index.js')


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

// Function call to initialize app
init();