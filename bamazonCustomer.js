const Table = require('cli-table')
require('dotenv').config()
const inquirer = require('inquirer')
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.dbServer,
  port: process.env.dbPort,
  user: process.env.dbUser,
  password: process.env.dbPass,
  database: process.env.db
})

connection.connect(function (error) {
  if (error) throw error
  // console.log(`connected as id ${connection.threadId}`)
  listInventory()
})

function listInventory () {
  let query = `select * from ${process.env.dbTable}`
  connection.query(query, function (error, response) {
    if (error) throw error
    let table = new Table({
      head: ['SKU', 'Product Name', 'Department', 'Price', 'In Stock']
    })
    for (let i = 0; i < response.length; i++) {
      table.push([`${response[i].sku}`, `${response[i].product_name}`, `${response[i].department_name}`, `${response[i].price}`, `${response[i].stock_quantity}`])
    }
    console.log(table.toString())
    inquirer.prompt({
      name: 'selectedSKU',
      type: 'input',
      message: 'Which SKU item would you like to buy?'
    })
    .then(function (itemToBuy) {
      // console.log(itemToBuy.selectedSKU)
      inquirer.prompt( {
        name: 'selectedQty',
        type: 'input',
        message: 'How many would you like?'
      }).then(function (qty) {
        // console.log(qty.selectedQty)
        console.log(`SKU: ${itemToBuy.selectedSKU}, QTY: ${qty.selectedQty}`);
      })
    })
  })
}