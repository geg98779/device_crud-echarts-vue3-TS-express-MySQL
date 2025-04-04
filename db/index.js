//import mysql
const mysql = require('mysql')

const db = mysql.createPool({
	host:'localhost',
	user:'device_system',
	password:'123456',
	database:'device_system',
	connectionLimit: 10,  // 连接池中的连接数
	database:'device_system'
})

module.exports = db