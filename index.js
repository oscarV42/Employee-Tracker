const inquirer = require('inquirer');

const question = [
    {
        
    },
];

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
         'Update an employee role']
        }
    ])
    .then((data) => {
        switch(data) {
            case 'View all departments':
                break;
            case 'View all roles':
                break;
            case 'View all employees':
                break;
            case 'Add a department':
                break;
            case 'Add a role':
                break;
            case 'Add an employee':
                break;
            case 'Update an employee role':
                break; 
        }   
    });
    
}

// Function call to initialize app
init();