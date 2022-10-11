const express = require('express')
const router = express()
const controller =  require('../Controller/device.controller')

router.get('/list', controller.GetList)
router.get('/all', controller.GetListALl)
router.post('/add', controller.postAdd)
router.get('/edit', controller.getEdit)
router.post('/edit', controller.postEdit)
router.delete('/delete', controller.delDelete)

module.exports = router