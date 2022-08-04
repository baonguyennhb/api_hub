const common = require('../Common/query')
const query = common.query

module.exports.GetList = async (req, res) => {
    try {
        let sql = 'SELECT * FROM MetterTag'
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

module.exports.GetAdd = async (req, res) => {
  try {
      let sql1 = 'SELECT * FROM Metter'
      const devices = await query(sql1)

      let sql2 = 'SELECT * FROM Tag'
      const tags = await query(sql2)

      const dataSend = {
          code: 200,
          message: "OK",
          data: {devices, tags}
      }
      res.status(200).send(dataSend)
  } catch (error) {
      console.log(error)
  }
}

module.exports.postAdd = async (req, res) => {

  try {
    let data = req.body
    let sql = `INSERT INTO MetterTag (device_id, tag_id) Values ( ${data.device_id}, ${data.tag_id} )`
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
    let sql = `SELECT * FROM MetterTag where id = ${id}`
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
    let sql = `UPDATE MetterTag SET device_id = ${data.device_id}, tag_id = ${data.tag_id} where id = ${id}`

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
    let sql = `DELETE FROM MetterTag where id = ${id}`

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