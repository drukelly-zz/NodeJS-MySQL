const Table = require('cli-table')
require('colors')
require('dotenv').config()
const formatMoney = require('./formatMoney')
const inquirer = require('inquirer')
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.dbServer,
  port: process.env.dbPort,
  user: process.env.dbUser,
  password: process.env.dbPass,
  database: process.env.db
})

let menuItems = ['View Products for Sale', 'View Low Inventory', 'Update Inventory', 'Add New Product']

connection.connect( error => {
  if (error) throw error
  // console.log(`connected as id ${connection.threadId}`)
  showMenu()
})

const updateInventory = () => {
  let questions = [{
    name: 'sku',
    type: 'input',
    message: 'Select a SKU:'
  }, {
    name: 'newQty',
    type: 'input',
    message: `What's the new quantity for this SKU?`
  }]
  const processUpdateInventory = (answers) => {
    let updateQuery = `update ${process.env.dbTable} set stock_quantity = ${answers.newQty} where sku = ${answers.sku}`
    connection.query(updateQuery, (error, response) => {
      if (error) throw error
      console.log(`Inventory updated for item with a SKU of ${answers.sku}!`.green)
    })
    connection.end()
  }
  // listInventory()
  // setTimeout(() => {
    inquirer.prompt(questions).then(processUpdateInventory)
  // }, 1000)
}

const addNewProduct = () => {
  let questions = [{
    name: 'sku',
    type: 'input',
    message: 'Provide a unique SKU:'
  }, {
    name: 'productName',
    type: 'input',
    message: 'Provide a product name:'
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
  // listInventory()
  // setTimeout(() => {
    inquirer.prompt(questions).then(processAddNew)
  // }, 1000)
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

const runCommand = command => {
  switch (command) {
    case menuItems[0]:
      listInventory()
      break
    case menuItems[1]:
      lowInventory()
      break
    case menuItems[2]:
      updateInventory()
    break
    case menuItems[3]:
      addNewProduct()
    break
  }
}

const showMenu = () => {
  welcomeSplash()
  inquirer.prompt({
    name: 'command',
    message: 'What would you like to do?',
    type: 'list',
    choices: menuItems
  }).then(managerSelection => {
    runCommand(managerSelection.command)
  })
}

const welcomeSplash = () => {
  console.log(`
  █▀▀▄ █▀▀█ █▀▄▀█ █▀▀█ ▀▀█ █▀▀█ █▀▀▄   █▀▄▀█ █▀▀█ █▀▀▄ █▀▀█ █▀▀▀ █▀▀ █▀▀█
  █▀▀▄ █▄▄█ █░▀░█ █▄▄█ ▄▀░ █░░█ █░░█   █░▀░█ █▄▄█ █░░█ █▄▄█ █░▀█ █▀▀ █▄▄▀
  ▀▀▀░ ▀░░▀ ▀░░░▀ ▀░░▀ ▀▀▀ ▀▀▀▀ ▀░░▀   ▀░░░▀ ▀░░▀ ▀░░▀ ▀░░▀ ▀▀▀▀ ▀▀▀ ▀░▀▀`.yellow)
}
