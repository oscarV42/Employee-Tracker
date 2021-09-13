DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE IF EXISTS employees_db;

USE employees_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_Id INT,
    FOREIGN KEY (department_Id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

