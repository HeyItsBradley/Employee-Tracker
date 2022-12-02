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

//menu
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

function showEmployees() {
  db.query("SELECT * FROM EMPLOYEE", (err, results) => {
    if (err) {
      console.error(err);
    } else {
      let createdTable = results;
      console.table(createdTable);
      showMenu();
    }
  });
}

function showRoles() {
  db.query("SELECT * FROM role", (err, results) => {
    let createdTable = results;
    console.table(createdTable);
    showMenu();
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
  });
}
//Runs ascii for title and then shows menu.
function makeAscii() {
  art.font("Employee Tracker", "/doom", (err, rendered) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rendered);
      showMenu();
    }
  }); //returns String
}
function init() {
  makeAscii();
}

init();
