const common = require('../Common/query')
const query = common.query
const { Telnet } = require('telnet-client')


module.exports.GetList = async (req, res) => {
    try {
        let sql = 'SELECT * FROM ApiSource'
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
module.exports.GetDetail = async (req, res) => {
    try {
        let sql = 'SELECT * FROM ApiSource WHERE id=?'
        const { apiSourceId } = req.query
        const params = [apiSourceId]
        const apiSource = await query(sql, params)
        const dataSend = {
            code: 200,
            message: "OK",
            data: apiSource
        }
        res.status(200).send(dataSend)
    } catch (error) {
        console.log(error)
    }
}
module.exports.postAdd = async (req, res) => {
    try {
        let data = req.body
        let getApiSource = await query(`SELECT * FROM ApiSource WHERE connection_name='${data.connection_name}'`)
        if (getApiSource.length > 0) {
            return res.status(200).send({
              code: 400,
              message: "API connection already exists!"
            })
          }
        let { authorization } = data
        let sql = ''
        if (authorization) {
            sql = `INSERT INTO ApiSource (connection_name, url, key_time, description, connection_time, interval, time_offset, is_authorization, username, password, status) Values ( '${data.connection_name}', '${data.url}' , '${data.key_time}','${data.description}' ,${data.check_connection_time}, ${data.interval}, 30, '${data.authorization}', '${data.username}', '${data.password}', 1 )`
        } else {
            sql = `INSERT INTO ApiSource (connection_name, url,  key_time, description, connection_time, interval, time_offset, is_authorization, status) Values ( '${data.connection_name}', '${data.url}' , '${data.key_time}' , '${data.description}' ,${data.check_connection_time}, ${data.interval}, 30, '${data.authorization}', 1 )`
        }
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

module.exports.postEdit = async (req, res) => {
    try {
        let id = req.query.id
        let data = req.body
        //let sql = `SELECT * FROM Metter `
        let sql = `UPDATE ApiSource SET connection_name = '${data.connection_name}', url = '${data.url}',  key_time = '${data.key_time}', description = '${data.description}', interval = ${data.interval} , connection_time = ${data.check_connection_time} where id = ${id}`

        //let sql = 'SELECT * FROM Metter'
        const api = await query(sql)
        const dataSend = {
            code: 200,
            message: "OK",
            data: api
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
        let sql = `DELETE FROM ApiSource where id = ${id}`

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


module.exports.GetTestConnect = async (req, res) => {
  try {
    let url = req.query.url
    const urlObject = new URL(url);
    const hostName = urlObject.hostname;
    const port = urlObject.port;

    const connection = new Telnet()
    const params = {
      host: hostName,
      port: port,
      shellPrompt: false, // '/ # ', // or negotiationMandatory: false
      timeout: 1000
    }
    let result = {code: 200, status: 'Connect suceessfully'}
    try {
      let rs = await connection.connect(params)
    } catch (error) {
      result = {code: 400, status: 'Connect faile' }
    }
    //console.log('rs', result)
    const dataSend = {
        code: 200,
        message: "OK",
        data: result
    }
    res.status(200).send(dataSend)
  } catch (error) {
      console.log(error)
      return
  }
}