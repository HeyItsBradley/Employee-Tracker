INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1 ), ('Lead Engineer', 150000, 2), ('Lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Bradley', 'Rodriguez', 2, null),('Timmy', 'Maestes', 1, 1),('Zeke', 'Ashlock', 3, null)