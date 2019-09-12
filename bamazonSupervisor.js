const mysql = require("mysql")
const inquirer = require("inquirer")
const Table = require("cli-table")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Jeannie63",
    database: "bamazon"
})

connection.connect((err) => {
    if (err) throw err
    console.log("connected as id " + connection.threadId)
    displayMenu()
})

function displayMenu(){
    inquirer
        .prompt([
            {
                name: "option",
                type: "list",
                message: "Select option:",
                choices: ["View Product Sales by Department", "Create New Department", "Quit"]
            }
        ])
        .then((res) => {
            switch(res.option){
                case "View Product Sales by Department":
                    viewSales()
                    break
                case "Create New Department":
                    getNewDeptDetails()
                    break
                case "Quit":
                    connection.end()
                    break
            }
        })
}

function viewSales(){
    connection.query("SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales, p.product_sales - d.over_head_costs as 'total_profit' FROM departments as d INNER JOIN products as p on p.department_id = d.department_id GROUP BY d.department_id", (err, res) =>{
        if (err) throw err
        var table = new Table({
            head: ["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"],
            colwidths: [100, 200]
        })

        for (let i=0; i<res.length; i++){
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit])
        }

        console.log(table.toString())
        displayMenu()
    })
}

function getNewDeptDetails(){
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Department name:"
            },
            {
                name: "cost",
                type: "input",
                message: "Overhead cost:"
            }
        ])
        .then((res) => {
            createDepartment(res.name, res.cost)
        })
}

function createDepartment(name, cost){
    connection.query("INSERT INTO departments SET ?", {department_name: name, over_head_costs: cost}, (err) => {
        if (err) throw err
        console.log(name + " department added.")
    })
    displayMenu()
}
