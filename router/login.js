// 完成注册与登录功能的路由

const express = require('express')

const router = express.Router()

const loginhandler = require('../router_handle/login')

const expressJoi = require('@escook/express-joi')

const {
	login_limit
} = require('../limit/login.js')

router.post('/register', expressJoi(login_limit), loginhandler.register)

router.post('/login', expressJoi(login_limit), loginhandler.login)

module.exports = router