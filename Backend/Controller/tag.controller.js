const common = require('../Common/query')
const query = common.query

module.exports.GetList = async (req, res) => {
    try {
        let sql = 'SELECT * FROM Tag'
        const tags = await query(sql)
        const dataSend = {
            code: 200,
            message: "OK",
            data: tags
        }
        res.status(200).send(dataSend)
    } catch (error) {
        console.log(error)
    }
}