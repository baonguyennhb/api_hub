const express = require('express')
const router = express()
const controller =  require('../Controller/tag.controller')

router.get('/list', controller.GetList)
router.post('/add', controller.postAdd)
router.get('/edit', controller.getEdit)
router.post('/edit', controller.postEdit)
router.delete('/delete', controller.delDelete)
router.get("/monitor", controller.MonitorTag)
module.exports = router