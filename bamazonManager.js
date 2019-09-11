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
                choices: ["View Inventory", "Low Inventory Items", "Add to Inventory", "Add New Product", "Quit"]
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
                case "Add New Product":
                    addNewProduct()
                    break
                case "Quit":
                    connection.end()
                    break
            }
        })
}

function renderTable(rows){
    let table = new Table({
            head: ["item_id", "product_name", "department_name", "price", "stock_quantity"],
            colwidths: [100, 200]
        })
    for (let i=0; i<rows.length; i++){
        table.push(rows[i])
    }
    console.log(table.toString())
}

function viewAllInventory(){
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err
        let rows = []

        for(let i=0; i<res.length; i++){
            rows.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
        }

        renderTable(rows)
        displayMenu()
    })
}

function viewLowInventory(){
    connection.query("SELECT * FROM products WHERE ?? <= ?", ["stock_quantity",5], (err, res) => {
        if (err) throw err
        let rows = []

        for (let i = 0; i < res.length; i++) {
            rows.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
        }

        renderTable(rows)
        displayMenu()
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
                        displayMenu()
                    })
            })
        })
}

function addNewProduct(){
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "Enter product name:"
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter quantity to stock:"
            },
            {
                name: "price",
                type: "input",
                message: "Enter sale price:"
            },
            {
                name: "department",
                type: "list",
                message: "Select department:",
                choices: ["Automotive","Books", "Clothing", "Electronics", "Food", "Home Goods", "Kids", "Pets", "Self-Care", "Sports & Outdoor", "Stationery"]
            }
        ])
        .then((ires) => {
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?) ",[ires.product, ires.department, parseFloat(ires.price), parseInt(ires.quantity)],(err, qres) => {
                if (err) throw err
                console.log("\n" + ires.quantity + " " + ires.product + " added to inventory.\n")
                displayMenu()
            })
        })
}


