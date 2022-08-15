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
    let sql = `INSERT INTO Tag (metter_id, name, parameter, data_type, scale) Values ( '${data.metterId}', '${data.name}', '${data.paramter}', '${data.data_type}', '${data.scale}' )`
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
    const metterSerial = tags[0].metter_id.split("_")[1]
    let dataSource = await fsPromises.readFile("data.json")
    dataSource = JSON.parse(dataSource)
    const dataByMetterAll = dataSource.data.filter(value => value.SO_CTO === metterSerial)
    const dataByMetterLast = dataByMetterAll[dataByMetterAll.length -1]
    let dataTag = []
    for (let i = 0; i < tags.length; i++) {
      const tagObject = {
        tagName: tags[i].name,
        value: dataByMetterLast[tags[i].parameter],
        timestamp: dataSource.timestamp
      }
      dataTag.push(tagObject)
    }
    const dataSend = {
      code: 200,
      message: "OK",
      data: dataTag
    }
    res.status(200).send(dataSend)
  } catch (error) {
    console.log(error)
  }
}