const common = require('../Common/query')
const query = common.query

module.exports.GetList = async (req, res) => {
    try {
        let sql = 'SELECT * FROM DataSource'
        const apiSources = await query(sql)
        const dataSend = {
            code: 200,
            message: "OK",
            data: apiSources
        }
        res.status(200).send(dataSend)
    } catch (error) {
        console.log(error)
    }
}