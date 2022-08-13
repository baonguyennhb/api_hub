const common = require('../Common/query')
const query = common.query

module.exports.GetList = async (req, res) => {
    try {
      const { metterId } = req.query
        let sql = 'SELECT * FROM Tag WHERE Metter=?'
        let params = [metterId]
        const devices = await query(sql, params)
        const dataSend = {
            code: 200,
            message: "OK",
            data: devices
        }
        res.status(200).send(dataSend)
    } catch (error) {
        console.log(error)
    }
}

module.exports.postAdd = async (req, res) => {

  try {
    let data = req.body
    let sql = `INSERT INTO Tag (metter, name, parameter, data_type, scale) Values ( '${data.metterId}', '${data.name}', '${data.paramter}', '${data.data_type}', '${data.scale}' )`
      //let sql = 'SELECT * FROM Metter'
    const devices = await query(sql)
    const dataSend = {
        code: 200,
        message: "OK",
        data: devices
    }
    res.status(200).send(dataSend)
  } catch (error) {
      console.log(error)
  }
}

module.exports.getEdit = async (req, res) => {
  try {
    let id = req.query.id
    //let data = req.body
    let sql = `SELECT * FROM Tag where id = ${id}`
      //let sql = 'SELECT * FROM Metter'
    const devices = await query(sql)
    const dataSend = {
        code: 200,
        message: "OK",
        data: devices
    }
    res.status(200).send(dataSend)
  } catch (error) {
      console.log(error)
  }
}

module.exports.postEdit = async (req, res) => {
  try {
    let id = req.query.id
    let data = req.body
    //let sql = `SELECT * FROM Metter `
    let sql = `UPDATE Tag SET name = '${data.name}' where id = ${id}`

      //let sql = 'SELECT * FROM Metter'
    const devices = await query(sql)
    const dataSend = {
        code: 200,
        message: "OK",
        data: devices
    }
    res.status(200).send(dataSend)
  } catch (error) {
      console.log(error)
  }
}

module.exports.delDelete = async (req, res) => {
  try {
    let id = req.query.id
    //let data = req.body
    //let sql = `SELECT * FROM Metter `
    let sql = `DELETE FROM Tag where id = ${id}`

      //let sql = 'SELECT * FROM Metter'
    const devices = await query(sql)
    const dataSend = {
        code: 200,
        message: "OK",
        data: devices
    }
    res.status(200).send(dataSend)
  } catch (error) {
      console.log(error)
  }
}