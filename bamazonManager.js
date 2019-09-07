const mysql = require("mysql")
const inquirer = require("inquirer")

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
                choices: ["View Inventory", "Low Inventory Items", "Add to Inventory", "Add New Product"]
            }
        ])
        .then((res) => {
            switch(res.option){
                case "View Inventory":
                    viewAllInventory()
                    break
                case "Low Inventory Items":
                    viewLowInventory()
                    break
            }
            connection.end()
        })
}

function viewAllInventory(){
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err
        console.log("\nitem_id" + " | " + "product_name" + " | " + "department_name" + " | " + "price" + " | " + "stock_quantity")

        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity)
        }

        console.log("-----------------------------------")
    })
}

function viewLowInventory(){

}