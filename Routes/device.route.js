const express = require('express')
const router = express()
const controller =  require('../Controller/device.controller')

router.get('/list', controller.GetList)
router.post('/add', controller.postAdd)
//router.get('/list', controller.GetList)

module.exports = router