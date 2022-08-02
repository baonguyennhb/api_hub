const express = require('express')
const router = express()
const controller =  require('../Controller/tag.controller')

router.get('/list', controller.GetList)

module.exports = router