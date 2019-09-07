const mysql = require("mysql")
const inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Jeannie63",
    database: "bamazon"
})

connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId)
    displayProducts()
    prompt()
    
})

function displayProducts() {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err
        console.log("item_id" + " | " + "product_name" + " | " + "department_name" + " | " + "price" + " | " + "stock_quantity")

        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity)
        }

        console.log("-----------------------------------")
    })
}

function prompt(){
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "Enter item_id to purchase:"
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter quantity to purchase:"
            }
        ])
        .then((res) => {
            connection.query("SELECT stock_quantity FROM products WHERE ?",
            {
                item_id: res.product
            },
            (err, qres) => {
                if (err) throw err
                
                if(qres[0].stock_quantity < res.quantity){
                    console.log("Insufficient quantity!")
                }
            }
            )
        connection.end()
        })
}
