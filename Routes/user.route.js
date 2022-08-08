const express = require('express')
const router = express()
const controller =  require('../Controller/user.controller')

router.post('/login', controller.Login)
router.post('/add', controller.postAdd)
router.get('/edit', controller.getEdit)
router.post('/edit', controller.postEdit)
router.delete('/delete', controller.delDelete)

module.exports = router