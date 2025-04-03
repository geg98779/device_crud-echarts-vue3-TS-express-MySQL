const express = require('express')
const app = express()
var bodyParser = require('body-parser')
//导入CORS解决跨域请求问题
const cors = require('cors')
//全局挂载
app.use(cors())
//当false 值为数组或字符串 true时值可以为任意类型
app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.listen(3307, () => {
	console.log('http://127.0.0.1:30073334')
})

