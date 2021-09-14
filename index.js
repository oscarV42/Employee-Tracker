const inquirer = require('inquirer');

const questions = [
    {
        type: 'input',
        message: 'Please enter the name of the department:',
        name: 'department_name'  
    },
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

    },
];

function choice_handler(answer){
    switch(answer) {
        case 'View all departments':
            break;
        case 'View all roles':
            break;
        case 'View all employees':
            break;
        case 'Add a department':
            inquirer.prompt(questions.department)
            .then((answer) =>{
                console.log(answer)
            })
            break;
        case 'Add a role':
            break;
        case 'Add an employee':
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