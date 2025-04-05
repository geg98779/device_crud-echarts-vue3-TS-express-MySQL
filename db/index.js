//import mysql
const mysql = require('mysql2')

const db = mysql.createPool({
	host:'localhost',
	user:'device_system',
	password:'123456',
	database:'device_system',
})

module.exports = db