const multer = require('multer')
const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')


var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/')
    },
    filename: (req, file, callBack) => {
        callBack(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        )
    },
})
var upload = multer({
    storage: storage,
})
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })
// app.post('/api/uploadcsv', upload.single('uploadcsv'), (req, res) => {
//     csvToDb(__dirname + '/uploads/' + req.file.filename)
//     res.json({
//         msg: 'File successfully inserted!',
//         file: req.file,
//     })
// })
function csvToDb(csvUrl) {
    let stream = fs.createReadStream(csvUrl)
    let collectionCsv = []
    let csvFileStream = csv
        .parse()
        .on('data', function (data) {
            collectionCsv.push(data)
        })
        .on('end', function () {
            collectionCsv.shift()
            db.connect((error) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log(collectionCsv)
                    // let query = 'INSERT INTO users (id, name, email) VALUES ?'
                    // db.query(query, [collectionCsv], (error, res) => {
                    //     console.log(error || res)
                    // })
                }
            })
            fs.unlinkSync(csvUrl)
        })
    stream.pipe(csvFileStream)
}

module.exports.UploadFile = async (req, res) => {
    await upload().single('uploadcsv')
    csvToDb(__dirname + '/uploads/' + req.file.filename)
    res.json({
        msg: 'File successfully inserted!',
        file: req.file,
    })
}