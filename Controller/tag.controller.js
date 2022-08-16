const common = require('../Common/query')
const query = common.query
var fsPromises = require('fs').promises;

module.exports.GetList = async (req, res) => {
  try {
    const { metterId } = req.query
    let sql = 'SELECT * FROM Tag WHERE metter_id=?'
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
    let sql = `INSERT INTO Tag (api_source, metter_id, name, parameter, data_type, scale) Values ( '${data.apiSource}', '${data.metterId}', '${data.name}', '${data.paramter}', '${data.data_type}', '${data.scale}' )`
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

module.exports.MonitorTag = async (req, res) => {
  try {
    const { metterId } = req.query
    let sql = 'SELECT * FROM Tag WHERE metter_id=?'
    let params = [metterId]
    const tags = await query(sql, params)
    const tagData = tags.map(tag => {
      return {
        id: tag.id,
        tagName: tag.name,
        tagParameter: tag.parameter,
        value: tag.last_value,
        timestamp: tag.timestamp
      }
    })
    const dataSend = {
      code: 200,
      message: "OK",
      data: tagData
    }
    res.status(200).send(dataSend)
  } catch (error) {
    console.log(error)
  }
}