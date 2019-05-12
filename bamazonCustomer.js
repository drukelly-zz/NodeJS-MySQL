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
  queryAll()
  connection.end()
})

function queryAll () {
  let query = `select * from ${process.env.dbTable}`
  connection.query(query, function (error, response) {
    if (error) throw error
    for (let i = 0; i < response.length; i++) {
      console.log(`${response[i].sku} | ${response[i].product_name} | ${response[i].department_name} | ${response[i].price} | ${response[i].stock_quantity}`)
    }
  })
}
