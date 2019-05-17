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

// const questions = [{
//   name: 'selectedSKU',
//   type: 'input',
//   message: 'Which SKU item would you like to buy?'
// }, {
//   name: 'selectedQty',
//   type: 'input',
//   message: 'How many would you like?'
// }]

connection.connect(error => {
  if (error) throw error
  // console.log(`connected as id ${connection.threadId}`)
  listInventory()
})

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
    welcomeSplash()
    console.log(table.toString())
    inquirer.prompt({
      name: 'selectedSKU',
      type: 'input',
      message: 'Which SKU item would you like to buy?'
    })
    .then(itemToBuy => {
      // console.log(itemToBuy.selectedSKU)
      // console.log(`The max is ${response.length}`)
      if (itemToBuy.selectedSKU > response.length) {
        doesntExists()
        process.exit(1)
      }
      inquirer.prompt( {
        name: 'selectedQty',
        type: 'input',
        message: 'How many would you like?'
      }).then(qty => {
        // console.log(`SKU: ${itemToBuy.selectedSKU}, QTY: ${qty.selectedQty}`);
        let buyQuery = `select * from ${process.env.dbTable} where sku = ${itemToBuy.selectedSKU} limit 1`;
        connection.query(buyQuery, (error, response) => {
          if (error) throw error
          let table = new Table({
            head: ['SKU', 'Quantity', 'Product Name', 'Department', 'Unit Price', 'Sub Total']
          })
          for (let i = 0; i < response.length; i++) {
            let sku = response[i].sku,
                productName = response[i].product_name,
                deptName = response[i].department_name,
                price = formatMoney(response[i].price),
                subTotal = formatMoney(response[i].price * qty.selectedQty),
                inStock = response[i].stock_quantity
            if (qty.selectedQty > inStock) {
              notEnough()
            } else {
              table.push([`${sku}`, `${qty.selectedQty}`, `${productName}`, `${deptName}`, `$${price}`, `$${subTotal}`])
              justBought()
              console.log(table.toString())
              let updateQuery = `update ${process.env.dbTable} set stock_quantity = ${inStock-qty.selectedQty} where sku = ${sku}`
              connection.query(updateQuery, (error, response) => {
                if (error) throw error
                console.log(`Inventory Updated!`.green)
              })
            }
            connection.end()
          }
        })
      })
    })
  })
}

// Big Text Generator
// [https://psfonttk.com/big-text-generator/]
const doesntExists = () => {
  console.log(`
░▀░ ▀▀█▀▀ █▀▀ █▀▄▀█   █▀▀▄ █▀▀█ █▀▀ █▀▀ █▀▀▄ █ ▀▀█▀▀   █▀▀ █░█ ░▀░ █▀▀ ▀▀█▀▀ █
▀█▀ ░░█░░ █▀▀ █░▀░█   █░░█ █░░█ █▀▀ ▀▀█ █░░█ ░ ░░█░░   █▀▀ ▄▀▄ ▀█▀ ▀▀█ ░░█░░ ▀
▀▀▀ ░░▀░░ ▀▀▀ ▀░░░▀   ▀▀▀░ ▀▀▀▀ ▀▀▀ ▀▀▀ ▀░░▀ ░ ░░▀░░   ▀▀▀ ▀░▀ ▀▀▀ ▀▀▀ ░░▀░░ ▄`.red)
}

const notEnough = () => {
  console.log(`
█▀▀▄ █▀▀█ ▀▀█▀▀   █▀▀ █▀▀▄ █▀▀█ █░░█ █▀▀▀ █░░█   ░▀░ █▀▀▄   █▀▀ ▀▀█▀▀ █▀▀█ █▀▀ █░█ █
█░░█ █░░█ ░░█░░   █▀▀ █░░█ █░░█ █░░█ █░▀█ █▀▀█   ▀█▀ █░░█   ▀▀█ ░░█░░ █░░█ █░░ █▀▄ ▀
▀░░▀ ▀▀▀▀ ░░▀░░   ▀▀▀ ▀░░▀ ▀▀▀▀ ░▀▀▀ ▀▀▀▀ ▀░░▀   ▀▀▀ ▀░░▀   ▀▀▀ ░░▀░░ ▀▀▀▀ ▀▀▀ ▀░▀ ▄`.red)
}

const justBought = () => {
  console.log(`
█░░█ █▀▀█ █░░█   ░░▀ █░░█ █▀▀ ▀▀█▀▀   █▀▀▄ █▀▀█ █░░█ █▀▀▀ █░░█ ▀▀█▀▀ ▄
█▄▄█ █░░█ █░░█   ░░█ █░░█ ▀▀█ ░░█░░   █▀▀▄ █░░█ █░░█ █░▀█ █▀▀█ ░░█░░ ░
▄▄▄█ ▀▀▀▀ ░▀▀▀   █▄█ ░▀▀▀ ▀▀▀ ░░▀░░   ▀▀▀░ ▀▀▀▀ ░▀▀▀ ▀▀▀▀ ▀░░▀ ░░▀░░ ▀`.green)
}

const welcomeSplash = () => {
  console.log(`
      █░░░█ █▀▀ █░░ █▀▀ █▀▀█ █▀▄▀█ █▀▀   ▀▀█▀▀ █▀▀█   █▀▀▄ █▀▀█ █▀▄▀█ █▀▀█ ▀▀█ █▀▀█ █▀▀▄ █
      █▄█▄█ █▀▀ █░░ █░░ █░░█ █░▀░█ █▀▀   ░░█░░ █░░█   █▀▀▄ █▄▄█ █░▀░█ █▄▄█ ▄▀░ █░░█ █░░█ ▀
      ░▀░▀░ ▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀▀ ▀░░░▀ ▀▀▀   ░░▀░░ ▀▀▀▀   ▀▀▀░ ▀░░▀ ▀░░░▀ ▀░░▀ ▀▀▀ ▀▀▀▀ ▀░░▀ ▄`.yellow)
}
