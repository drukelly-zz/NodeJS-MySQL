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
      listInventory()
      break
    case menuItems[1]:
      lowInventory()
      break
    case menuItems[2]:
      console.log(menuItems[2].toUpperCase().bold.black)
    break
    case menuItems[3]:
      addNew()
    break
  }
}

const addNew = () => {
  let questions = [{
    name: 'sku',
    type: 'input',
    message: 'Provide a unique SKU'
  }, {
    name: 'productName',
    type: 'input',
    message: 'Provide a product name'
  }, {
    name: 'deptName',
    type: 'input',
    message: 'Which department should this product belong to?'
  }, {
    name: 'price',
    type: 'input',
    message: 'How much does this product cost?'
    }, {
    name: 'stockQty',
    type: 'input',
    message: 'How many of this product do you want to stock?'
  }]
  const processAddNew = (answers) => {
    // let's test the inputs!
    // console.log(answers.sku, answers.productName, answers.deptName, answers.price, answers.stockQty)
    let addQuery = `insert into ${process.env.dbTable} (sku, product_name, department_name, price, stock_quantity) values (${answers.sku}, "${answers.productName}", "${answers.deptName}", ${answers.price}, ${answers.stockQty})`
    connection.query(addQuery, (error, response) => {
      if (error) throw error
      let table = new Table({
        head: ['SKU', 'Product Name', 'Department', 'Unit Price', 'In Stock']
      })
      let sku = answers.sku,
          productName = answers.productName,
          deptName = answers.deptName,
          price = formatMoney(answers.price),
          inStock = answers.stockQty
      table.push([`${sku}`, `${productName}`, `${deptName}`, `$${price}`, `${inStock}`])
      console.log(`The following item has been added!`.yellow)
      console.log(table.toString())
    })
    connection.end()
  }
  inquirer.prompt(questions).then(processAddNew)
}

const listInventory = () => {
  let initQuery = `select * from ${process.env.dbTable}`
  connection.query(initQuery, (error, response) => {
    if (error) throw error
    let table = new Table({
      head: ['SKU', 'Product Name', 'Department', 'Unit Price', 'In Stock']
    })
    for (let i = 0; i < response.length; i++) {
      let sku = response[i].sku,
          productName = response[i].product_name,
          deptName = response[i].department_name,
          price = formatMoney(response[i].price),
          inStock = response[i].stock_quantity
      table.push([`${sku}`, `${productName}`, `${deptName}`, `$${price}`, `${inStock}`])
    }
    console.log(table.toString())
  })
  connection.end()
}

const lowInventory = () => {
  let initQuery = `select * from ${process.env.dbTable} where stock_quantity < 5`
  connection.query(initQuery, (error, response) => {
    if (error) throw error
    let table = new Table({
      head: ['SKU', 'Product Name', 'Department', 'Unit Price', 'In Stock']
    })
    for (let i = 0; i < response.length; i++) {
      let sku = response[i].sku,
          productName = response[i].product_name,
          deptName = response[i].department_name,
          price = formatMoney(response[i].price),
          inStock = response[i].stock_quantity
      table.push([`${sku}`, `${productName}`, `${deptName}`, `$${price}`, `${inStock}`])
    }
    console.log(table.toString())
  })
  connection.end()
}

/*

√ If a manager selects View Products for Sale, the app should list every available item: the item SKUs, names, prices, and quantities.
√ If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
- If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
√ If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

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