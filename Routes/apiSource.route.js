const express = require('express')
const router = express()
const controller =  require('../Controller/apiSource.controller')


router.get('/list', controller.GetList)
router.get('/detail', controller.GetDetail)
router.post('/add', controller.postAdd)
router.post('/edit', controller.postEdit)
router.delete('/delete', controller.delDelete)

router.get('/test-connect', controller.GetTestConnect)

module.exports = router