const express = require('express')
const router = express()
const controller =  require('../Controller/apiSource.controller')


router.get('/list', controller.GetList)

module.exports = router