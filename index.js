const inquirer = require("inquirer");
const Font = require("ascii-art-font");
const art = require("ascii-art");
const mysql = require("mysql2");
const cTable = require("console.table");
const { create } = require("ascii-art-table");
Font.fontPath = "Fonts";

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

//menu options
const menuSelect = [
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Roles",
      "View All Departments",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
    ],
    name: "choice",
  },
];
//questions when adding a department
const addingDepartmentQuestions = [
  {
    type: "input",
    message: "What will be the name of the department?",
    name: "departmentName",
  },
];

//makes a query and returns back employee table
function showEmployees() {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, employee.manager_id  FROM((employee JOIN role ON employee.role_id = role.id) JOIN department ON department.id = role.department_id) ",
    (err, results) => {
      console.table(results);
      showMenu();
    }
  );
}
//makes a query and returns back roles table
function showRoles() {
  db.query(
    "SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id",
    (err, results) => {
      console.table(results);
      showMenu();
    }
  );
}
//makes a query and returns back departments table
function showDepartments() {
  db.query("SELECT * FROM department", (err, results) => {
    console.table(results);
    showMenu();
  });
}
//adds a department
function addDepartment() {
  inquirer.prompt(addingDepartmentQuestions).then((Response) => {
    db.query(
      "INSERT INTO department (name) VALUES (?)",
      Response.departmentName,
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Department Added !");

          showMenu();
        }
      }
    );
  });
}
//adds a role
function addRole() {
  currentDepartments = [];
  db.query("SELECT * FROM department", (err, results) => {
    for (i = 0; i < results.length; i++) {
      currentDepartments.push(results[i].name);
    }
    const addingRoleQuestions = [
      {
        type: "input",
        message: "What will be the name of the role?",
        name: "name",
      },
      {
        type: "input",
        message: "What will be the salary?",
        name: "salary",
      },
      {
        type: "list",
        message: "What department is the role in?",
        choices: currentDepartments,
        name: "departmentSelection",
      },
    ];
    inquirer.prompt(addingRoleQuestions).then((Response) => {
      let department_id = 0;
      for (i = 0; i < results.length; i++) {
        if (Response.departmentSelection == results[i].name) {
          department_id = results[i].id;
        }
      }

      db.query(
        `INSERT INTO role (title, salary, department_id) VALUES 
        ("${Response.name}", ${Response.salary}, ${department_id});`,
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Role Added!");
          }
        }
      );
      showMenu();
    });
  });
}
//adds an employee
function addEmployee() {
  currentRoles = [];
  db.query("SELECT * FROM role", (err, results) => {
    console.log(results);
    for (i = 0; i < results.length; i++) {
      currentRoles.push(results[i].title);
    }
    const addingEmployeeQuestions = [
      {
        type: "input",
        message: "What is the Employees first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the Employees last name?",
        name: "LastName",
      },
      {
        type: "list",
        message: "What is the Employees role",
        choices: currentRoles,
        name: "roleSelection",
      },

      {
        type: "input",
        message: "Select a manager ID, enter 0 for no manager",
        name: "Manager",
      },
    ];

    inquirer.prompt(addingEmployeeQuestions).then((Response) => {
      let roleId = 0;
      for (i = 0; i < results.length; i++) {
        if (Response.roleSelection == results[i].title) {
          roleId = results[i].department_id;
        }
      }

      let manager = 0;

      if (Response.Manager == 0) {
        manager = null;
      } else {
        manager = Response.Manager;
      }

      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
      ("${Response.firstName}", "${Response.LastName}", ${roleId}, ${manager});`,
        (err, results) => {
          if (err) {
            console.log(err);
          } else console.log("Emplyoee Add!");
        }
      );
      showMenu();
    });
  });
}
//updates an employees role
function updateEmployee() {
  let roleList = [];

  let employeeList = [];
  var thisEmployee = "";
  var thisRole = "";

  db.query("SELECT * FROM employee", (err, results) => {
    for (i = 0; i < results.length; i++) {
      employeeList.push(results[i].first_name);
    }
    const selectEmployee = [
      {
        type: "list",
        message: "Which Employees role would you like to change",
        choices: employeeList,
        name: "employee",
      },
    ];
    inquirer.prompt(selectEmployee).then((Response) => {
      for (i = 0; i < results.length; i++) {
        if (Response.employee === results[i].first_name) {
          thisEmployee = results[i].id;
          console.log(thisEmployee);
        }
      }
      db.query("Select * FROM role", (err, data) => {
        for (i = 0; i < data.length; i++) {
          roleList.push(data[i].title);
        }
        const selectRole = [
          {
            type: "list",
            message: "What is their new role?",
            choices: roleList,
            name: "role",
          },
        ];
        inquirer.prompt(selectRole).then((Response) => {
          for (i = 0; i < data.length; i++) {
            if (Response.role === data[i].title) {
              thisRole = data[i].id;
              console.log(`emp is ${thisEmployee}, role is ${thisRole}`);
              db.query(
                `UPDATE employee SET role_id = ${thisRole} WHERE id = ${thisEmployee}`,
                (err, results) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("role updated!");
                    showMenu();
                  }
                }
              );
            }
          }
        });
      });
    });
  });
}
//will display the menu
function showMenu() {
  inquirer.prompt(menuSelect).then((Response) => {
    if (Response.choice === "View All Employees") {
      showEmployees();
    }
    if (Response.choice === "View All Roles") {
      showRoles();
    }
    if (Response.choice === "View All Departments") {
      showDepartments();
    }
    if (Response.choice === "add a department") {
      addDepartment();
    }
    if (Response.choice === "add a role") {
      addRole();
    }
    if (Response.choice === "add an employee") {
      addEmployee();
    }
    if (Response.choice === "update an employee role") {
      updateEmployee();
    }
  });
}
//Runs ascii for title and then shows menu.
function makeAscii() {
  art.font("Employee Tracker", "/doom", (err, rendered) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rendered);
      // updateDepartments();
      showMenu();
    }
  }); //returns String
}
function init() {
  makeAscii();
}

init();
