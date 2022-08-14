const express = require('express')
const router = express()
const controller =  require('../Controller/apiSource.controller')


router.get('/list', controller.GetList)
router.get('/detail', controller.GetDetail)
router.post('/add', controller.postAdd)
router.delete('/delete', controller.delDelete)

module.exports = router