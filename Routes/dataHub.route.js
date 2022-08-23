const express = require('express')
const router = express()
const controller =  require('../Controller/datahub.controller')

router.get('/detail', controller.GetDetail)
router.post('/edit', controller.postEdit)
router.post('/add/tag', controller.AddTag)
router.get('/list/tag', controller.GetListTag)

module.exports = router