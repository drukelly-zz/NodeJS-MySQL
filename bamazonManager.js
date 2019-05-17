// TODO
// bamazonManager

const Table = require('cli-table')
require('colors')
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

connection.connect( error => {
  if (error) throw error
  // console.log(`connected as id ${connection.threadId}`)
  showMenu()
})

/* Instructions:

Create a new Node application called bamazonManager.js. Running this application will:

List a set of menu options:

- View Products for Sale
- View Low Inventory
- Add to Inventory
- Add New Product

*/
let menuItems = ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']

const showMenu = () => {
  console.log(`
█▀▀▄ █▀▀█ █▀▄▀█ █▀▀█ ▀▀█ █▀▀█ █▀▀▄   █▀▄▀█ █▀▀█ █▀▀▄ █▀▀█ █▀▀▀ █▀▀ █▀▀█
█▀▀▄ █▄▄█ █░▀░█ █▄▄█ ▄▀░ █░░█ █░░█   █░▀░█ █▄▄█ █░░█ █▄▄█ █░▀█ █▀▀ █▄▄▀
▀▀▀░ ▀░░▀ ▀░░░▀ ▀░░▀ ▀▀▀ ▀▀▀▀ ▀░░▀   ▀░░░▀ ▀░░▀ ▀░░▀ ▀░░▀ ▀▀▀▀ ▀▀▀ ▀░▀▀`.yellow)
  inquirer.prompt({
    name: 'command',
    message: 'What would you like to do?',
    type: 'list',
    choices: menuItems
  }).then(managerSelection => {
    runCommand(managerSelection.command)
  })
}

const runCommand = command => {
  switch (command) {
    case menuItems[0]:
      console.log(menuItems[0])
      
      break
    case menuItems[1]:
      console.log(menuItems[1])
      break
    case menuItems[2]:
      console.log(menuItems[2])
      break
    case menuItems[3]:
      console.log(menuItems[3])
     break
  }
  process.exit(1)
}

/*

If a manager selects View Products for Sale, the app should list every available item: the item SKUs, names, prices, and quantities.
If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

*/

// [https://stackoverflow.com/a/149099]
const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
  try {
    decimalCount = Math.abs(decimalCount)
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount

    const negativeSign = amount < 0 ? "-" : ""

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()
    let j = (i.length > 3) ? i.length % 3 : 0

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "")
  } catch (e) {
    console.log(e)
  }
}