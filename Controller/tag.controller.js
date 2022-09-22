const moment = require('moment');
const common = require('../Common/query')
const query = common.query
var fsPromises = require('fs').promises;

function trimObject(obj) {
  var trimmed = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
  return JSON.parse(trimmed);
}

module.exports.GetList = async (req, res) => {
  try {
    const { metterId, apiSourceId } = req.query
    let sql
    let params = []
    if (metterId) {
      sql = 'SELECT * FROM Tag WHERE metter_id=? AND api_source=?'
      params = [metterId, apiSourceId]
    } else {
      sql = 'SELECT * FROM Tag'
      params = []
    }
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
  let start = moment().startOf('days')
  try {
    let data = req.body
    data = trimObject(data)
    // Check ton tai Tag
    let getTagName = await query(`SELECT * FROM Tag WHERE metter_id='${data.metterId}' AND api_source=${data.apiSource} AND name='${data.name}'`)
    if (getTagName.length > 0) {
      return res.status(200).send({
        code: 400,
        message: "Tag Name already exists!"
      })
    }
    let getTagParams = await query(`SELECT * FROM Tag WHERE metter_id='${data.metterId}' AND api_source=${data.apiSource} AND parameter='${data.parameter}'`)
    if (getTagParams.length > 0) {
      return res.status(200).send({
        code: 400,
        message: "Parameter already exists!"
      })
    }
    // Check ton tai Tag

    let sql = `INSERT INTO Tag (api_source, metter_id, name, parameter, data_type, scale) 
                Values ( ${data.apiSource}, '${data.metterId}', '${data.name}', '${data.parameter}', '${data.data_type}', '${data.scale}' )`
    const tagCreate = await query(sql)

    //console.log(devices)
    let str_sql = `SELECT * FROM Metter where metter_id = '${data.metterId}' and api_source = ${data.apiSource} `
    let metter = await query(str_sql)
    let tag = await query(`SELECT * FROM Tag where metter_id = '${data.metterId}' and api_source = ${data.apiSource} and parameter = '${data.parameter}'`)

    //console.log(tag)

    for (let i = 0; i < 48; i++) {
      timestamp_str = moment(start).format('YYYY-MM-DD HH:mm:ss')

      let sql2 = `INSERT INTO RawData (timestamp, api_source, metter_id, tag_name, serial, param, tag_id) 
      Values ( '${timestamp_str}', ${data.apiSource}, '${data.metterId}', '${data.name}', ${metter[0].serial}, '${data.parameter}', ${tag[0].id} )`
      const result2 = await query(sql2)

      start = moment(start).add(30, 'minutes')
      //console.log(metter_tags)
    }

    const dataSend = {
      code: 200,
      message: "OK",
      data: tag[0]
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
    let sql = `UPDATE Tag SET name = '${data.name}', scale = '${data.scale}', data_type = '${data.data_type}' where id = ${id}`
    let sql_update_raw_data = `UPDATE RawData SET tag_name = '${data.name}' where tag_id = ${id}`
    //let sql = 'SELECT * FROM Metter'
    const tag = await query(sql)
    const updateTagRawData = await query(sql_update_raw_data)
    const dataSend = {
      code: 200,
      message: "OK",
      data: tag
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
    const rs_del = await query(`Delete From RawData where tag_id = ${id}`)
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
    const { metterId, apiSourceId } = req.query
    let sql = 'SELECT * FROM Tag WHERE metter_id=? AND api_source=?'
    let params = [metterId, apiSourceId]
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

module.exports.MonitorTagLog = async (req, res) => {
  try {
    const { tagId } = req.query
    const now = moment().format("YYYY-MM-DD HH:mm:ss")
    let sql = `SELECT * FROM RawData WHERE tag_id=? AND timestamp<?  ORDER BY timestamp DESC`
    let tagInfo = await query('SELECT * FROM Tag WHERE id=?', [tagId])
    let tagName = tagInfo[0]?.name
    let params = [tagId, now]
    const tags = await query(sql, params)
    const tagData = tags.map(tag => {
        return {
          ...tag,
          tag_name: tagName
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