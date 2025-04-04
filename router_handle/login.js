const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtconfig = require('../jwt_config/index.js')

exports.register = (req,res) => {
	const reginfo = req.body
	console.log("reginfo")
	if(!reginfo.account || !reginfo.password) {
		return res.send({
			status: 1,
			message: '账号或密码不能为空'
		})
	}
	// 判断用户是否已经在数据表中
	const sql = 'select * from users where account = ?'
	db.query(sql,reginfo.account,(err,results) => {
		if(results.length > 0){
			return res.send({
				status:1,
				message: '账号已存在'
			})
		}
		//使用加密中间件 对密码加密
		reginfo.password = bcrypt.hashSync(reginfo.password,10)
		//把账号和密码插入到数据表中
		const sql1 = 'insert into users set ?'
		const identity = '用户'
		const create_time = new Date()
		db.query(sql1,{
			account: reginfo.account,
			password: reginfo.password,
			identity,
			create_time,
			status:0,
		},(err,results) =>{
			if(results.affectedRows !== 1){
				return res.send({
					status: 1,
					message: '注册账号失败'
				}) 
			}
			res.send({
				status: 1,
				message: '注册账号成功'
			})
		})
	})
}

exports.login = (req,res) =>{
	const loginfo = req.body
	const sql = 'select * from users where account = ?'
	db.query(sql, loginfo.account,(err,results) => {
		//执行sql语句失败的情况 一般是数据库断开的情况
		if(err) return res.cc(err)
		if(results.length !== 1) return res.cc('登录失败')
		const compareResult = bcrypt.compareSync(loginfo.password, results[0].password)
		if(!compareResult){
			return res.cc('登录失败')
		}
		if(results[0].status == 1){
			return res.cc('账号被冻结')
		}
		//剔除加密后的密码，头像，创建时间，更新时间
		const user = {
			...results[0],
			password:'',
			imageUrl:'',
			create_time:'',
			update_time:''
		}
		//设置token有效时长 有效期为7个小时
		const tokenStr = jwt.sign(user,jwtconfig.jwtSecretkey,{
			expiresIn:'7h',
			
		})
		res.send({
			results:results[0],
			status:0,
			message:'登录成功',
			token:'Bearer' + tokenStr,
			
		})
	})
}