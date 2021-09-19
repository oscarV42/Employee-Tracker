INSERT INTO departments (department_name)
VALUES ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");


INSERT INTO roles (role_title, role_salary,department_id)
VALUES ("Sales Lead", 100000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Accountant", 125000, 3),
        ("Legal Team Lead", 250000, 4);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Noah","Hudson", 1, null),
        ("Adam","Evenson", 2,1),
        ("Ken","Angelos", 3, 2),
        ("Terri","Jodice", 4, 3);
        