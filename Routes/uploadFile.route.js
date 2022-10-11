const express = require('express')
const router = express()
const controller = require('../Controller/uploadFile')
const controllerExport = require('../Controller/exportExcel')

router.post('/file', controller.UploadFile)
router.get('/file', controllerExport.ExportExcel)
module.exports = router