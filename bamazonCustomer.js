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
    displayProducts()
})

function displayProducts() {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err

        var table = new Table({
            head: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
            colwidths: [100, 200]
        })

        for (let i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
        }

        console.log(table.toString())
        makePurchase()
    })
}

function makePurchase(){
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
        .then((ires) => {
            connection.query("SELECT stock_quantity, price, product_sales FROM products WHERE ?",
            {
                item_id: ires.product
            },
            (err, qres) => {
                if (err) throw err

                if(qres[0].stock_quantity < ires.quantity){
                    console.log("Insufficient quantity!")
                }
                else{
                    completeTransaction(ires.product, qres[0].stock_quantity, ires.quantity, qres[0].price, qres[0].product_sales)
                }
            }
            )
        })
}

function completeTransaction(product, stockQuant, orderQuant, price, productSales){
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: stockQuant - orderQuant
            },
            {
                item_id: product
            }
        ],
        (err) => {
            if (err) throw err
            let total = (price*orderQuant).toFixed(2)
            console.log("\n-----------------------------")
            console.log("Total: $" + total)
            console.log("-----------------------------")
            updateSalesTotal(product, total, productSales)
        })
}

function updateSalesTotal(product, total, productSales){
    connection.query("UPDATE products SET ?? = ? WHERE ?? = ?", ["product_sales", parseFloat(productSales) + parseFloat(total), "item_id", product], (err) => {
        if (err) throw err
        connection.end()
    })
}

