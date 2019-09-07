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
                case "Add to Inventory":
                    addInventory()
                    break
            }
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
        connection.end()
    })
}

function viewLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", (err, res) => {
        if (err) throw err

        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity)
        }

        console.log("-----------------------------------")
        connection.end()
    })
}

function addInventory(){
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "Enter item_id to restock:"
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter quantity to order:"
            }
        ])
        .then((ires) => {
            connection.query("SELECT stock_quantity, price FROM products WHERE ?",
            {
                item_id: ires.product
            },
            (err, qres1) => {
                if (err) throw err
                let curQuant = qres1[0].stock_quantity
                
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: curQuant + parseInt(ires.quantity)
                        },
                        {
                            item_id: ires.product
                        }
                    ],
                    (err, qres2) => {
                        if (err) throw err
                        console.log(qres2)
                        connection.end()
                    })
            })
        })
}



