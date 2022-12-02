const inquirer = require("inquirer");
const Font = require("ascii-art-font");
const art = require("ascii-art");
Font.fontPath = "Fonts";

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

function makeAscii() {
  art.font("Employee Tracker", "/doom", (err, rendered) => {
    if (err) {
      console.log(err);
    } else {
      console.log(rendered);
      inquirer.prompt(menuSelect);
    }
  }); //returns String
}
function init() {
  makeAscii();
  inquirer.prompt(menuSelect);
}

init();
