const express = require('express')
const group = require('express-group-routes')
var cors = require('cors')
const axios = require('axios').default;
let xmlParser = require('xml2json');
const moment = require('moment')
var bodyParser = require('body-parser')
const common = require('./Common/query')
const query = common.query
const mqtt = require('mqtt');
var EventEmitter = require('events')
const CronJob = require('cron').CronJob;


const port = 4000

const app = express()
app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Variable

let groupId = 'scada_UzVa32VanG4I'
let mqttUrl = "mqtt://rabbitmq-001-pub.hz.wise-paas.com.cn:1883"
let mqttTopicConn = `iot-2/evt/waconn/fmt/${groupId}`
let mqttTopicCfg = `iot-2/evt/wacfg/fmt/${groupId}`
let mqttTopicSendata = `iot-2/evt/wadata/fmt/${groupId}`
let HbtInterval = 5

var options = {
  port: 1883,
  username: 'Goy2waYPAGQP:d1ejmm44L8QV',
  password: 'uOh4z8bvRPyIVHBlIiXI',
};

// Connect MQTT Broker 

let client
let is_data_hub_connected = false
let is_error = false
let is_config = false
var event = new EventEmitter()

// Handle Connect MQTT and Push data

const ConnectionMessage = require("./EdgeSdk/ConnectionMessage")
const HeartBeatMessage = require("./EdgeSdk/HeartBeatMessage")
const ConfigTagMessage = require("./EdgeSdk/ConfigTagMesage")
const DeleteTagConfigMessage = require("./EdgeSdk/DeleteTagMessage")
const ValueTagMessage = require("./EdgeSdk/ValueTagMesage")
const BackUpValueTagMessage = require("./EdgeSdk/BackupTagMessage")

//=================================================
// Init
async function Init() {
  let config = await query(`SELECT * FROM DataHub`)
  let options = {
    port: 1883,
    username: config[0].username, //     'Goy2waYPAGQP:n3Q78J2BBKeK',
    password: config[0].password, //    'CVemCimzm0duGLr6OnvJ',
    reconnectPeriod: 5000,
    connectTimeout: 5000
  };

  groupId = config[0].group_id //'scada_qQ2N60h1DmL'
  mqttUrl = "mqtt://" + config[0].host + ":" + config[0].port
  mqttTopicConn = `iot-2/evt/waconn/fmt/${groupId}`
  mqttTopicCfg = `iot-2/evt/wacfg/fmt/${groupId}`
  mqttTopicSendata = `iot-2/evt/wadata/fmt/${groupId}`
  _stTopic = `iot-2/evt/wast/fmt/${groupId}`
  HbtInterval = config[0].heart_beat

  client = mqtt.connect(mqttUrl, options);

  //console.log(options, config[0])

  client.on("connect", async ack => {
    try {
      console.log("MQTT Client Connected!")
      client.subscribe('test', function (err) {
        if (!err) {
          console.log(`Subscribe Topic ${_stTopic}`)
        }
      })
      is_error = false
      const _connectionMessage = ConnectionMessage(groupId)
      client.publish(mqttTopicConn, JSON.stringify(_connectionMessage), { qos: 1, retain: false })
      // console.log("Connect success!")
      setInterval(sendHeartBeatMessage, HbtInterval * 1000)
      // Send Tag Config
      if (!is_config) {
        sendTagConfigMessage()
        console.log(" Config tag success!")
      }
    } catch (error) {
      console.log(error)
    }
  })
  //==================================================
  client.on("reconnect", async ack => {
    try {
      console.log("MQTT Reconnect !")
    } catch (error) {
      console.log(error)
    }
  })
  client.on("error", async function (ack) {
    try {
      console.log("MQTT Error!", ack.message)
      is_error = true
      // let config = await query(`SELECT * FROM DataHub`)
      // let options = {
      //   port: 1883,
      //   username: config[0].username, //     'Goy2waYPAGQP:n3Q78J2BBKeK',
      //   password: config[0].password, //    'CVemCimzm0duGLr6OnvJ',
      //   reconnectPeriod: 2000,
      //   connectTimeout: 5000
      // };

      // groupId = config[0].group_id //'scada_qQ2N60h1DmL'
      // mqttUrl = "mqtt://" + config[0].host + ":" + config[0].port
      // mqttTopicConn = `iot-2/evt/waconn/fmt/${groupId}`
      // mqttTopicCfg = `iot-2/evt/wacfg/fmt/${groupId}`
      // mqttTopicSendata = `iot-2/evt/wadata/fmt/${groupId}`
      // HbtInterval = config[0].heart_beat

      // console.log(config[0])

      // await delay(2000)
      // client.reconnect(mqttUrl, options)

    } catch (error) {
      console.log(error)
    }
  })
  client.on("close", ack => {
    try {
      console.log("MQTT close!", ack?.message)
    } catch (error) {
      console.log(error)
    }
  })
  client.on("disconnect", ack => {
    try {
      console.log("MQTT disconnect!", ack?.message)
    } catch (error) {
      console.log(error)
    }
  })
  client.on("offline", ack => {
    try {
      console.log("MQTT offline!", ack?.message)
    } catch (error) {
      console.log(error)
    }
  })
  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(`SubScribe Topic: ${topic}`)
    console.log(`Message: ${message.toString()}`)
  })
  //==================================================


}

//Init()

async function PublishDataHub() {
  let data_hub_cgf = await getDataHubConfig()
  let nextPublish = data_hub_cgf.interval * 1000
  SendDataTagToDataHub()
  setTimeout(PublishDataHub, nextPublish)
}
PublishDataHub()


async function getDataHubConfig() {
  let sql = "SELECT * FROM DataHub"
  const data_hub_cgf = await query(sql)
  return data_hub_cgf[0]
}

const sendHeartBeatMessage = () => {
  const _messageHeartBeat = HeartBeatMessage(groupId)
  const topic = mqttTopicConn
  client?.publish(topic, JSON.stringify(_messageHeartBeat), { qos: 1, retain: false });
}

const sendTagConfigMessage = async () => {
  try {
    const topic = mqttTopicCfg
    const data_hub_cgf = await getDataHubConfig()
    const groupId = data_hub_cgf.group_id
    const heatbeat = data_hub_cgf.heart_beat
    const allTag = await getMqttTag()
    const profileConfigTag = await query("SELECT * FROM ProfileConfig")
    const diffTag = profileConfigTag.filter(({ name: name1 }) => !allTag.some(({ name: name2 }) => name2 === name1));
    console.log(diffTag)
    //===============>
    const _messageConfigTag = ConfigTagMessage(groupId, allTag, diffTag)
    client?.publish(topic, JSON.stringify(_messageConfigTag), { qos: 1, retain: false });
    if (client?.connected) {
      let profileDeleted = await query('DELETE FROM ProfileConfig')
      let profileUpdated = await query(`INSERT INTO ProfileConfig (id, name) SELECT id , name FROM MqttTag`)
    }
    is_config = true
    //===============>
    //const _messageDeleteAllConfigTag = DeleteTagConfigMessage.DeleteAllTag(profileConfigTag, groupId, heatbeat)
    // Delete All Tag Before Upload A New Config
    // rs = client?.publish(topic, JSON.stringify(_messageDeleteAllConfigTag, { qos: 1, retain: false }))
    // if (!rs.connected) {
    //   return
    // }
    // setTimeout(async () => {
    //   // Upload a New Config
    //   const _messageConfigTag = ConfigTagMessage(groupId, allTag)
    //   client?.publish(topic, JSON.stringify(_messageConfigTag), { qos: 1, retain: false });
    //   if (client.connected) {
    //     let profileDeleted = await query('DELETE FROM ProfileConfig')
    //     let profileUpdated = await query(`INSERT INTO ProfileConfig (id, name) SELECT id , name FROM MqttTag`)
    //   }
    // }, 5000)
  } catch (error) {
    console.log(error)
  }
}

const SendDeleteConfigTag = async (tag, groupId, heatbeat) => {
  const _messageDeleteConfigTag = DeleteTagConfigMessage.DeleteTag(tag, groupId, heatbeat)
  console.log("Delete!")
  console.log(_messageDeleteConfigTag)
  const topic = mqttTopicCfg
  client?.publish(topic, JSON.stringify(_messageDeleteConfigTag), { qos: 1, retain: false });
}

const SendDataTagToDataHub = async () => {
  try {
    //console.log(moment().format("HH:mm:ss"))
    const allTag = await getMqttTag()
    var result_array_tag_id = [];
    for (var i = 0; i < allTag.length; i++) {
      result_array_tag_id[i] = allTag[i].id;
    }
    let sqlSelectTag = `select * from Tag where id IN (${result_array_tag_id.toString()})`
    let allTagWithData = await query(sqlSelectTag)
    allTagWithData = allTagWithData.map(value => {
      return {
        name: `${value.metter_id}:${value.name}`,
        last_value: value?.data_type === "Number" ? parseFloat(value.last_value) : value.last_value,
        time_in_api_source: value.time_in_api_source,
        tag_id: value.id
      }
    })
    const topic = mqttTopicSendata
    const valueTagMessage = ValueTagMessage(allTagWithData, groupId)
    //client.publish(topic, JSON.stringify(valueTagMessage), { qos: 1, retain: false });
    let rs = client.publish(topic, JSON.stringify(valueTagMessage), { qos: 1, retain: false });
    if (rs.connected) {
      console.log("Push Success")
      console.log("Update Send Status Success")
      updateIsSent(allTagWithData)
    }
    //console.log(rs)
  } catch (error) {
    console.log(error)
    console.log("Push Failed!")
  }

}


const getMqttTag = async () => {
  let sql = "SELECT * FROM MqttTag"
  const allTag = await query(sql)
  return allTag
}

// Handle Call API with 1 api source
async function callAPI(api_source, start) {
  try {
    let startOfDate = moment(start).startOf('day').format("YYYY-MM-DD HH:mm:ss")
    let params
    let sNoList = await api_source.metters.map(metter => metter.serial)
    let d = {}
    params = {
      sNoList: sNoList.toString(), // 20697927, //sNoList,  //20698013,20697912
      sTime: startOfDate     // startOfDate
    }
    const response = await axios.get(api_source.url, { params })
    let xmlData = response.data
    let jsonData = xmlParser.toJson(xmlData)
    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement?.dtResult
    return {
      data: valueData,
      ts: moment().format("YYYY-MM-DD HH:mm:ss")
    }
  } catch (error) {
    console.log(error)
  }
}

//=================================================
// Read Metter as interval

async function ReadMetter() {
  try {

    var nextExecutionTime = await getMetterInterval();
    let api_sources = await getApiSource()

    let start = moment().startOf('days')
    if (moment().hour() <= 0) {
      start = moment().subtract(2, 'hours').startOf('days')
    }
    console.log(start)

    let testTime = "2022-06-18 00:00:00"

    //====> Update LastValue in Tag Table

    let sql = "SELECT * " +
      "FROM ApiSource " +
      "LEFT JOIN Metter " +
      "ON ApiSource.id = Metter.api_source " +
      "LEFT JOIN Tag " +
      "ON Tag.metter_id = Metter.metter_id"

    const allTags = await query(sql)

    let dataOfAllApiSource = {}
    for (let i = 0; i < api_sources.length; i++) {
      const api_source = api_sources[i];
      dataOfAllApiSource[`${api_source.connection_name}`] = await callAPI(api_source, start)
    }

    for (let i = 0; i < allTags.length; i++) {
      if (allTags[i].connection_name && allTags[i].metter_id && allTags[i].parameter) {
        let apiSource = allTags[i].connection_name
        let apiSourceId = allTags[i].api_source
        let serialMetter = allTags[i].serial
        let parameterTag = allTags[i].parameter
        let dataType = allTags[i].data_type
        let scale = allTags[i].scale
        let metterId = allTags[i].metter_id
        let filterDataBySerial = dataOfAllApiSource[`${apiSource}`].data?.filter(value => value.SO_CTO === serialMetter.toString())
        let timestamp = dataOfAllApiSource[`${apiSource}`].ts
        let tagData = filterDataBySerial?.length ? filterDataBySerial[filterDataBySerial.length - 1][`${parameterTag}`] : undefined
        let time_in_api_source = filterDataBySerial?.length ? filterDataBySerial[filterDataBySerial.length - 1][`NGAYGIO`] : undefined
        //console.log(tagData)
        if (tagData !== undefined) {
          let dataByScale
          if (dataType === "Number") {
            dataByScale = tagData * scale
          } else {
            dataByScale = tagData
          }
          let sqlUpdateValue = `UPDATE Tag SET last_value = '${dataByScale}', timestamp = '${timestamp}', time_in_api_source = '${time_in_api_source}' where api_source = '${apiSourceId}' AND metter_id = '${metterId}' AND parameter= '${parameterTag}'`
          const updated = await query(sqlUpdateValue)
        }
      }
    }
    //=====> Update Last Value in Tag Table

    //=====> Insert Raw Data

    for (let i = 0; i < api_sources.length; i++) {

      const api_source = api_sources[i];

      let all_tags = await getTagInRawNeedupdate(api_source.id, start)
      let data_sources = await callAPI(api_source, start)
      //console.log('All_tags', all_tags.length)
      if (all_tags && data_sources.data) {
        for (let j = 0; j < all_tags.length; j++) {
          const tag = all_tags[j];
          //console.log(tag)
          const result = data_sources.data.find(({ NGAYGIO, SO_CTO }) => NGAYGIO === tag.timestamp.toString() && SO_CTO == tag.serial.toString());

          let _tag = await query(`SELECT * From Tag where metter_id = '${tag.metter_id}' and parameter = '${tag.param}'`)

          if (result) {
            //console.log('---> tag', _tag[0].data_type, result[tag.param], _tag[0].scale)
            let _value = _tag[0]?.data_type == "Number" ? parseFloat(result[tag.param]) * parseFloat(_tag[0].scale) : result[tag.param]
            let rs = await query(`UPDATE RawData SET value = '${_value}', is_had_data = 1 WHERE id = ${tag.id}`);
          }

        }
      }
    }
    //=====> Insert Raw Data
    console.log("---> Read Data OK", moment().format('HH:mm:ss'))

  }
  catch (error) {
    console.log(error)
  }

  setTimeout(ReadMetter, nextExecutionTime);

}

ReadMetter()



async function getMetterInterval() {
  try {
    let sql = 'SELECT * FROM ApiSource'
    const result = await query(sql)
    return result[0].interval * 1000
  } catch (error) {
    console.log(error)
  }

}

async function getApiSource() {
  try {
    let sql = 'SELECT * FROM ApiSource where is_active = 1'
    const api_sources = await query(sql)
    for (let i = 0; i < api_sources.length; i++) {
      const api_source = api_sources[i];
      let metters = await query(`SELECT * FROM Metter where api_source = ${api_source.id}`)
      let tags = []
      for (let j = 0; j < metters.length; j++) {
        const metter = metters[j];
        let tags = await query(`SELECT * FROM Tag where metter_id = '${metter.metter_id}'`)
        metters[j].tags = tags
      }
      api_sources[i].metters = metters
    }
    return api_sources
  } catch (error) {
    console.log(error)
  }
}

async function setTagInRawData() {
  try {
    let start = moment().startOf('day')

    let sql = `SELECT Tag.id as TagId, * FROM Tag 
                JOIN Metter on Metter.metter_id = Tag.metter_id and Metter.api_source = Tag.api_source
              `
    const tags = await query(sql)

    //console.log('tags', tags)

    for (let i = 0; i < 48; i++) {
      timestamp_str = start.format('YYYY-MM-DD HH:mm:ss')
      await tags.forEach(async e => {
        let sql2 = `INSERT INTO RawData (timestamp, api_source, tag_id, metter_id, serial, param, tag_name) Values ( '${timestamp_str}', ${e.api_source}, ${e.TagId}, '${e.metter_id}', ${e.serial}, '${e.parameter}', '${e.name}' )`
        try {
          await query(sql2)
        } catch (error) {
          //console.log(error.message)
        }

      });

      start = moment(start).add(30, 'minutes')
      //console.log(metter_tags)
    }

  } catch (e) {
    console.log(e.message)
  }



  //let sql = 'SELECT * FROM Metter'


  //return 
}

async function getTagInRawNeedupdate(api_source, start1) {
  try {
    let start = moment(start1).format('YYYY-MM-DD HH:mm:ss')
    let end = moment().format('YYYY-MM-DD HH:mm:ss')
    let sql = `SELECT DISTINCT timestamp, serial, param, id, metter_id  FROM RawData WHERE timestamp BETWEEN '${start}' AND '${end}' and is_had_data = 0 and api_source = ${api_source}`
    const tags = await query(sql)
    return tags
  } catch (error) {
    console.log(error)
  }
}

//============================================================

const deviceRouter = require('./Routes/device.route')
const tagRouter = require('./Routes/tag.route')
const deviceTagRouter = require('./Routes/device_tag.route')
const userRouter = require('./Routes/user.route')
const apiSourceRouter = require('./Routes/apiSource.route');
const dataHubRouter = require('./Routes/dataHub.route');

const { stat } = require('fs');
const delay = require('delay');

app.group('/api/v1', (router) => {
  router.use('/user', userRouter)
  router.use('/api-source', apiSourceRouter)
  router.use('/device', deviceRouter)
  router.use('/tag', tagRouter)
  router.use('/device_tag', deviceTagRouter)
  router.use('/data-hub', dataHubRouter)
})

// Delete Tag Mqtt

app.delete('/api/v1/data-hub/remove/tag', (req, res) => {
  DeleteMqttTag(req, res)
})

const DeleteMqttTag = async (req, res) => {
  try {
    let id = req.query.id

    let tagDelete = await query(`SELECT * FROM MqttTag where id = ${id}`)

    SendDeleteConfigTag(tagDelete[0], groupId, 5)

    let sql = `DELETE FROM MqttTag where id = ${id}`

    const mqttTag = await query(sql)

    const dataSend = {
      code: 200,
      message: "OK",
      data: mqttTag
    }
    res.status(200).send(dataSend)
  } catch (error) {
    console.log(error)
  }
}

app.post("/api/v1/data-hub/upload-config", async (req, res) => {
  try {
    is_config = false
    const data = req.body
    console.log(data)
    const group_id = data.group_id.trim()
    const host = data.host.trim()
    const port = data.port
    const username = data.username.trim()
    const password = data.password.trim()
    const updatedDataHub = await query(`UPDATE DataHub SET group_id = '${group_id}', host = '${host}', port = '${port}', username = '${username}', password = '${password}', interval = '${data.interval}'`)
    if (client) {
      client.end()
    }
    await Init()
    //await sendTagConfigMessage()
    const dataSend = {
      "code": 200,
      "message": "OK",
      "data": "Config tag successfully!"
    }
    res.status(200).send(dataSend)

  } catch (error) {
    console.log(error)
  }
})

//================================================================
// Run job every 0h5 am everyday
var job0h5 = new CronJob('5 0 * * *', async function () {
  await setTagInRawData()

  await delRawData()
}, null, true, 'Asia/Ho_Chi_Minh');

job0h5.start()
setTagInRawData()
delRawData()

//================================================================
// Check Status API SOURCE

//================================================================

//================================================================
// Check Status Device

async function CheckDeviceStatus() {
  try {

    let api_sources = await getApiSource()

    let start = moment().startOf('days')
    if (moment().hour() <= 0) {
      start = moment().subtract(2, 'hours').startOf('days')
    }

    let testTime = "2022-06-18 00:00:00"

    console.log("Time Check: " + moment(start).format("YYYY-MM-DD HH:mm:ss"))

    //====> Update LastValue in Tag Table

    let dataOfAllApiSource = {}
    for (let i = 0; i < api_sources.length; i++) {
      const api_source = api_sources[i];
      dataOfAllApiSource[`${api_source.connection_name}`] = await callAPI(api_source, start)
    }

    let sql = "SELECT * " +
      "FROM ApiSource " +
      "LEFT JOIN Metter " +
      "ON ApiSource.id = Metter.api_source "

    const allMetter = await query(sql)
    //console.log(allMetter)

    for (let i = 0; i < allMetter.length; i++) {
      let apiSource = allMetter[i].connection_name
      let serialMetter = allMetter[i].serial
      let id = allMetter[i].id
      let filterDataBySerial = dataOfAllApiSource[`${apiSource}`].data?.filter(value => value.SO_CTO === serialMetter.toString())
      let NGAYGIO = filterDataBySerial?.length ? filterDataBySerial[filterDataBySerial.length - 1][`NGAYGIO`] : undefined
      // console.log(moment().unix())
      // console.log(moment(NGAYGIO).unix())
      if (NGAYGIO !== undefined) {
        let deltaTime = moment().unix() - moment(NGAYGIO).unix()
        let statusDevice = (deltaTime > 7200) ? 0 : 1
        //console.log(deltaTime)
        let updatedDevice = await query(`UPDATE Metter SET status= ${statusDevice} WHERE id=${id} `)
      }
    }
    //=====> Insert Raw Data
    console.log("---> Check Status", moment().format('HH:mm:ss'))
    console.log("UPDATE STATUS METTER SUCESS!")
  }
  catch (error) {
    console.log(error)
  }
}

setInterval(CheckDeviceStatus, 2 * 60 * 1000)

//================================================================

async function delRawData() {
  try {
    let end = moment().subtract(3, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    let sql_str = `DELETE FROM RawData WHERE timestamp < '${end}'`
    console.log(sql_str)
    let rs = await query(sql_str)
    console.log('====> Deleted' + rs)
  } catch (err) {
    console.log("====> Error Delete" + err.message)
  }

}

//=================================== BackUp Function=============
// Update Mqtt Tag After Send Data-Hub Sucess

async function updateIsSent(tags) {
  try {
    for (let i = 0; i < tags.length; i++) {
      let tag_id = tags[i].tag_id
      let time_in_api_source = tags[i].time_in_api_source
      let tagInRawData = await query(`SELECT * FROM RawData WHERE tag_id = ${tag_id} AND timestamp = '${time_in_api_source}' AND is_had_data = 1`)
      if (tagInRawData.length > 0) {
        let updated = await query(`UPDATE RawData SET is_sent = 1 WHERE tag_id = ${tag_id} AND timestamp = '${time_in_api_source}' AND is_had_data = 1`)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

// BackUp Data To Data-Hub

async function BackUpMqtt() {
  try {
    if (client?.connected !== true) {
      console.log("No Mqtt Client!")
      return
    }
    const now = moment().format("YYYY-MM-DD HH:mm:ss")
    let getDataBackup = await query("SELECT * FROM RawData WHERE is_had_data = 1 AND is_sent = 0 ORDER BY timestamp")
    if (getDataBackup.length == 0) {
      console.log("No Data Backup!")
      return
    }

    let dataBackup = getDataBackup.map(value => {
      return {
        ...value,
        tag_id: value.tag_id,
        name: `${value.metter_id}:${value.tag_name}`,
        last_value: value.value
      }
    })
    //console.log(dataBackup)

    let i = 0

    let handle = setInterval(async () => {
      // Push Data Backup to DataHub

      const topic = mqttTopicSendata
      const valueTagMessage = BackUpValueTagMessage(dataBackup[i], groupId)
      //client.publish(topic, JSON.stringify(valueTagMessage), { qos: 1, retain: false });

      let rs = client?.publish(topic, JSON.stringify(valueTagMessage), { qos: 1, retain: false });
      if (rs?.connected) {
        console.log("Push Backup Success")
        let updateIsSent = await query(`UPDATE RawData SET is_sent = 1 WHERE id=${dataBackup[i].id}`)
        console.log("Update Send Status Success")
      }
      i++
      if (i > getDataBackup.length - 1) clearInterval(handle)
    }, 2000)

  } catch (error) {
    console.log("Push Backup Data Failed!")
  }
}
// Run job every 2 minute
var job2min = new CronJob('*/5 * * * *', async function () {
  console.log("Backuping!")
  await BackUpMqtt()
}, null, true, 'Asia/Ho_Chi_Minh');

job2min.start()



