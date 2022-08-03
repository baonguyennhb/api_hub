const express = require('express')
const router = express()
const controller =  require('../Controller/user.controller')

router.post('/login', controller.Login)

module.exports = router