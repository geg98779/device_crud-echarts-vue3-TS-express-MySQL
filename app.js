const express = require('express')
const app = express()
var bodyParser = require('body-parser')
//导入CORS解决跨域请求问题
const cors = require('cors')
const Joi = require('joi')
//全局挂载
app.use(cors())
//当false 值为数组或字符串 true时值可以为任意类型
app.use(bodyParser.urlencoded({extended: false}))
//处理json格式数据
app.use(bodyParser.json())

app.use((req,res,next) => {
	res.cc = (err,status = 1) => {
		res.send({
			status,
			message:err instanceof Error ? err.message : err,
		})
	}
	next()
})

const jwtconfig = require('./jwt_config/index.js')
const {expressjwt: jwt} = require('express-jwt')
app.use(jwt({
	secret:jwtconfig.jwtSecretkey, algorithms:['HS256']
}).unless({
	path:[/^\/api\//]
}))

const loginRouter = require('./router/login')
app.use('/api',loginRouter)
 
//对不符合joi规则的情况进行报错
app.use((err,req,res,next) => {
	if(err instanceof Joi.ValidationError) return res.cc(err)
})
 
app.listen(3007, () => {
	console.log('http://127.0.0.1:3007')
})

