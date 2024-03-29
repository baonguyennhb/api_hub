const common = require('../Common/query')
const query = common.query

function trimObject(obj){
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
        let sql = 'SELECT * FROM Metter WHERE api_source=?'
        const  { apiSource } = req.query
        let params = [apiSource]
        const devices = await query(sql,params)
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

module.exports.GetListALl = async (req, res) => {
  try {
      let sql = 'SELECT * FROM Metter'
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

module.exports.postAdd = async (req, res) => {
  try {
    let data = req.body
    data = trimObject(data)
    let getSerial = await query(`SELECT * FROM Metter WHERE serial=${data.serial} AND api_source=${data.apiSource}`)
    if (getSerial.length > 0) {
      return res.status(200).send({
        code: 400,
        message: "Serial already exists!"
      })
    }
    let getMetterId = await query(`SELECT * FROM Metter WHERE metter_id='${data.metter_id}' AND api_source=${data.apiSource}`)
    if (getMetterId.length > 0) {
      return res.status(200).send({
        code: 400,
        message: "Metter ID already exists!"
      })
    }
    let sql = `INSERT INTO Metter (api_source, serial, metter_id, description, interval, status) Values ( ${data.apiSource}, ${data.serial} , '${data.metter_id}', '${data.description}', ${data.interval}, 0 )`
    const devices = await query(sql)
    const dataSend = {
        code: 200,
        message: "OK",
        data: data
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
    let sql = `SELECT * FROM Metter where id = ${id}`
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
    data = trimObject(data)
    //let sql = `SELECT * FROM Metter `
    let sql = `UPDATE Metter SET description = '${data.description}', interval= ${data.interval}  where id = ${id}`

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
    let sql = `DELETE FROM Metter where id = ${id}`

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
