const common = require('../Common/query')
const query = common.query

module.exports.Login = async (req, res) => {
    try {
        let sql = 'SELECT * FROM users'
        const user = await query(sql)
        console.log(user)
        const dataSend = {
            "code": 200,
            "message": "Login successed",
            "data": {
                "_id": "62b087eb8657583558f88e52",
                "name": "Nguyen Huu Bao",
                "email": "bao.nh@gmail.com",
            },
            "meta": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmIwODdlYjg2NTc1ODM1NThmODhlNTIiLCJpYXQiOjE2NTk0MzMzMjQsImV4cCI6MTY5MDk2OTMyNH0.5K8hBS6B31SZuuaQtjwTCWsorLq8vV4EpAvzZCtaq64",
            }

        }
        res.status(200).send(dataSend)
    } catch (error) {
        console.log(error)
    }
}