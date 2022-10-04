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

// Connect MQTT Broker 

let client
let is_config = false
let is_connected = false

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
    clientId: `EdgeAgent_${Math.floor(Math.random() * 10)}`,
    reconnectPeriod: 30000,
    connectTimeout: 30000
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
      is_error = false
      is_connected = true
      const _connectionMessage = ConnectionMessage(groupId)
      client.publish(mqttTopicConn, JSON.stringify(_connectionMessage), { qos: 1, retain: false })
      setInterval(sendHeartBeatMessage, HbtInterval * 1000)

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
      is_connected = false
    } catch (error) {
      console.log(error)
    }
  })
  client.on("close", ack => {
    try {
      console.log("MQTT close!", ack?.message)
      is_connected = false
    } catch (error) {
      console.log(error)
    }
  })
  client.on("disconnect", ack => {
    try {
      console.log("MQTT disconnect!", ack?.message)
      is_connected = false
    } catch (error) {
      console.log(error)
    }
  })
  client.on("offline", ack => {
    try {
      console.log("MQTT offline!", ack?.message)
      is_connected = false
    } catch (error) {
      console.log(error)
    }
  })
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
    const diffTag = profileConfigTag.filter(({ name: name1, tag_type: type1 }) => !allTag.some(({ name: name2, tag_type: type2 }) => name2 === name1 && type1 === type2));
    console.log("Diff Tag:")
    console.log(diffTag)
    //===============>
    const _messageConfigTag = ConfigTagMessage(groupId, allTag, diffTag)
    client?.publish(topic, JSON.stringify(_messageConfigTag), { qos: 1, retain: false });
    if (client?.connected === true) {
      let profileDeleted = await query('DELETE FROM ProfileConfig')
      let profileUpdated = await query(`INSERT INTO ProfileConfig (id, name, tag_type) SELECT id , name, tag_type FROM MqttTag`)
      is_config = true
    }
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
  try {
    const _messageDeleteConfigTag = DeleteTagConfigMessage.DeleteTag(tag, groupId, heatbeat)
    console.log("Delete!")
    console.log(JSON.stringify(_messageDeleteConfigTag))
    const topic = mqttTopicCfg
    let rs = client?.publish(topic, JSON.stringify(_messageDeleteConfigTag), { qos: 1, retain: false });
    if (rs?.connected === true) {
      return true
    } else return false
  } catch (error) {
    console.log(error)
  }
}

const SendDataTagToDataHub = async () => {
  try {
    //console.log(moment().format("HH:mm:ss"))
    const allTag = await getMqttTag()
    var result_array_tag_id = [];
    for (var i = 0; i < allTag.length; i++) {
      result_array_tag_id[i] = allTag[i].id;
    }
    let getTimeStampInApiSource = await query("SELECT DISTINCT time_in_api_source  FROM Tag")
    //console.log(getTimeStampInApiSource)
    for (let i = 0; i < getTimeStampInApiSource.length; i++) {
      let timestampStr = getTimeStampInApiSource[i].time_in_api_source
      let timestampFormat = moment(getTimeStampInApiSource[i]?.time_in_api_source).format()
      let sqlSelectTag = `select * from Tag where id IN (${result_array_tag_id.toString()}) and time_in_api_source='${timestampStr}'`
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
      const valueTagMessage = ValueTagMessage(allTagWithData, groupId, timestampFormat)
      //client.publish(topic, JSON.stringify(valueTagMessage), { qos: 1, retain: false });
      if (is_config) {
        let rs = client.publish(topic, JSON.stringify(valueTagMessage), { qos: 1, retain: false });
        if (rs.connected) {
          let time = moment().format("HH:mm:ss")
          console.log(`Push Success - time: ${time}`)
          updateIsSent(allTagWithData)
          console.log(`Update Send Status Success - time: ${time}`)
        }
      }
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
    //console.log(startOfDate)
    let params
    let sNoList = await api_source.metters.map(metter => metter.serial)
    let d = {}

    params = {
      sNoList: sNoList.toString(), // 20697927, //sNoList,  //20698013,20697912
      //sTime: startOfDate     // startOfDate
    }
    params[`${api_source.key_time}`] = startOfDate
    const response = await axios.get(api_source.url, { params })
    let xmlData = response.data
    let jsonData = xmlParser.toJson(xmlData)
    const valueDataTemp = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement?.dtResult
    //console.log(valueDataTemp)
    let valueData = []
    if (sNoList.length === 1 && api_source.key_time === "sDate") {
      valueData.push(valueDataTemp)
    } else {
      valueData = valueDataTemp
    }
    //console.log(valueData)
    let customValueData = valueData?.map(value => {
      return {
        ...value,
        SO_CTO: (value?.METER_NO !== undefined) ? value?.METER_NO : value?.SO_CTO,
        NGAYGIO: (value?.DATE_TIME !== undefined) ? value.DATE_TIME : value?.NGAYGIO
      }
    })
    //console.log(customValueData[customValueData.length - 1])
    return {
      data: customValueData,
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
      "ON Tag.metter_id = Metter.metter_id AND Tag.api_source = Metter.api_source"

    const allTags = await query(sql)

    let dataOfAllApiSource = {}
    for (let i = 0; i < api_sources.length; i++) {
      const api_source = api_sources[i];
      dataOfAllApiSource[`${api_source.connection_name}`] = await callAPI(api_source, start)
      await delay(5000)
    }
    for (let i = 0; i < allTags.length; i++) {
      if (allTags[i].connection_name && allTags[i].metter_id && allTags[i].parameter) {
        let apiSource = allTags[i].connection_name
        //console.log(apiSource)
        let apiSourceId = allTags[i].api_source
        let serialMetter = allTags[i].serial
        let parameterTag = allTags[i].parameter
        //console.log(parameterTag)
        let dataType = allTags[i].data_type
        let scale = allTags[i].scale
        let metterId = allTags[i].metter_id
        let filterDataBySerial = dataOfAllApiSource[`${apiSource}`].data?.filter(value => value?.SO_CTO === serialMetter.toString())
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
          //console.log(sqlUpdateValue)
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
          const result = data_sources.data.find(({ NGAYGIO, SO_CTO }) => NGAYGIO === tag.timestamp.toString() && SO_CTO == tag.serial.toString());

          let _tag = await query(`SELECT * From Tag where api_source = '${tag.api_source}' and metter_id = '${tag.metter_id}' and parameter = '${tag.param}'`)

          if (result) {
            //console.log('---> tag', _tag[0].data_type, result[tag.param], _tag[0].scale)
            let _value = _tag[0]?.data_type == "Number" ? parseFloat(result[tag.param]) * parseFloat(_tag[0].scale) : result[tag.param]
            let rs = await query(`UPDATE RawData SET value = '${_value}', is_had_data = 1 WHERE id = ${tag.id}`);
          }

        }
      }
    }
    //=====> Insert Raw Data
    console.log("------------> Read Data OK", moment().format('HH:mm:ss'))

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
}

async function getTagInRawNeedupdate(api_source, start1) {
  try {
    let start = moment(start1).format('YYYY-MM-DD HH:mm:ss')
    let end = moment().format('YYYY-MM-DD HH:mm:ss')
    let sql = `SELECT DISTINCT timestamp, serial, param, id, metter_id, api_source  FROM RawData WHERE timestamp BETWEEN '${start}' AND '${end}' and is_had_data = 0 and api_source = ${api_source}`
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

    //SendDeleteConfigTag(tagDelete[0], groupId, 5)

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

app.post('/api/v1/data-hub/remove-config/tag', async (req, res) => {
  try {
    let tag = {
      name: req.body.tagName.trim()
    }
    if (!is_connected) {
      return res.status(200).send({
        code: 400,
        error: "Delete Config failed because no connect with Data Hub!"
      })
    }
    if (tag.name === "") {
      return res.status(200).send({
        code: 400,
        error: "No Tag Config Name, Please Input Tag Name!"
      })
    }
    let rs = await SendDeleteConfigTag(tag, groupId, 5)
    if (rs) {
      return res.status(200).send({
        code: 200,
        message: `Delete Config of Tag ${tag.name} Sucessfully!`
      })
    } else {
      res.status(200).send({
        code: 400,
        message: `Delete Config of Tag ${tag.name} Failed!`
      })
    }
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/v1/data-hub/connect", (req, res) => {
  try {
    if (client?.connected == true) {
      res.status(200).send({
        code: 200,
        data: 1
      })
    } else {
      res.status(200).send({
        code: 200,
        data: 0
      })
    }
  } catch (error) {

  }
})

app.get("/api/v1/data-hub/disconnect", async (req, res) => {
  try {
    if (client?.connected) {
      client.end(true, {}, async () => {
        await delay(2000)
        res.status(200).send({
          code: 200,
          message: "Close connecttion Sucessfully!"
        })
      })
    } else {
      res.status(200).send({
        code: 400,
        error: "Close failed because no connect with Data Hub!"
      })
    }
  } catch (error) {
    console.log(error)
  }
})

app.post("/api/v1/data-hub/connect", async (req, res) => {
  try {
    const data = req.body
    console.log(data)
    const group_id = data.group_id.trim()
    const host = data.host.trim()
    const port = data.port
    const username = data.username.trim()
    const password = data.password.trim()
    const updatedDataHub = await query(`UPDATE DataHub SET group_id = '${group_id}', host = '${host}', port = '${port}', username = '${username}', password = '${password}', interval = '${data.interval}'`)

    if (client) {
      client.end(true, {}, async () => {
        await Init()
        await delay(2000)
        // client.on("connect", () => {
        if (is_connected) {
          res.status(200).send({
            code: 200,
            message: "Connect Sucessfully!"
          })
        }
        // })
        // client.on("error", () => {
        else {
          res.status(200).send({
            code: 400,
            error: "Connect Failed, Please check infomation again!"
          })
        }
        // })
      })
    } else {
      await Init()
      await delay(2000)
      if (is_connected) {
        res.status(200).send({
          code: 200,
          message: "Connect Sucessfully!"
        })
      }
      // })
      // client.on("error", () => {
      else {
        res.status(200).send({
          code: 400,
          error: "Connect Failed, Please check infomation again!"
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
})

app.post("/api/v1/data-hub/upload-config", async (req, res) => {
  try {
    is_config = false
    //=========> Send Tag Config
    if (!is_config) {
      await sendTagConfigMessage()
      console.log(" Config tag success!")
    }
    if (client?.connected === true) {
      const dataSend = {
        "code": 200,
        "message": "OK",
        "data": "Config tag successfully!"
      }
      res.status(200).send(dataSend)
    } else {
      const dataSend = {
        "code": 400,
        "message": "OK",
        "data": "No Connection, Please connect with Data Hub!"
      }
      res.status(200).send(dataSend)
    }
    //await sendTagConfigMessage()
  } catch (error) {
    console.log(error)
  }
})
//=================Push Manually=================================

app.post("/api/v1/push-manual", async (req, res) => {
  try {
    const metterIds = req.body.metter
    const rangeTime = req.body.rangeTime
    const apiSourceId = req.body.apiSource
    if (rangeTime === null) {
      return res.status(200).send({
        code: 400,
        error: "Please Select time get data"
      })
    }
    if (metterIds.length === 0) {
      return res.status(200).send({
        code: 400,
        error: "No Metter, Please Select Metter!"
      })
    }
    if (!is_connected) {
      return res.status(200).send({
        code: 400,
        error: "No connect with Data Hub, Please check connection!"
      })
    }

    let fromTime, toTime
    if (rangeTime !== null) {
      fromTime = req.body.rangeTime[0]
      toTime = req.body.rangeTime[1]
      // console.log(fromTime + "-" + toTime)
    }
    var from = moment(rangeTime[0]);
    var to = moment(rangeTime[1]);
    const diffday = to.diff(from, 'days')   // =1
    // console.log(diffday)
    let arrayDay = []
    for (let i = 0; i < diffday + 1; i++) {
      let intDay = moment(fromTime).add(i, 'days').startOf('days').format("YYYY-MM-DD HH:mm:ss")
      arrayDay.push(intDay)
    }
    // Get ApiSource information
    const getApiSource = await query(`SELECT * FROM ApiSource WHERE id = ${apiSourceId}`)
    let keyTime = getApiSource[0]?.key_time
    // Get Serial Metter
    let metterIdsString = metterIds.map(value => `'${value}'`)
    const metters = await query(`SELECT * FROM Metter WHERE metter_id IN(${metterIdsString}) AND api_source = ${apiSourceId}`)
    const api_source = {
      ...getApiSource[0],
      metters: metters
    }
    // Get Tag infomation
    const _allTags = await query(`SELECT * FROM Tag WHERE metter_id IN(${metterIdsString}) AND api_source = ${apiSourceId}`)

    for (let i = 0; i < arrayDay.length; i++) {
      const data = await callAPI(api_source, arrayDay[i])
      let dataSource = data.data
      let _timestamp = arrayDay[i]
      if (keyTime === 'sTime') {
        for (let j = 0; j < 48; j++) {
          let tagTempArray = []
          for (let z = 0; z < _allTags.length; z++) {
            let serial = _allTags[z].metter_id.split("_")[1]
            const resultDataByMetter = dataSource.find(({ NGAYGIO, SO_CTO }) => NGAYGIO === _timestamp && SO_CTO === serial.toString());
            if (resultDataByMetter) {
              // console.log("Data: ")
              // console.log(resultDataByMetter)
              let value = (_allTags[z].data_type === "Number") ? parseFloat(resultDataByMetter[_allTags[z].parameter]) : resultDataByMetter[_allTags[z].parameter]
              tagTempArray.push({
                name: `${_allTags[z].metter_id}:${_allTags[z].name}`,
                last_value: value
              })
            }
          }
          //console.log(tagTempArray)
          const topic = mqttTopicSendata
          let timestampFormat = moment(_timestamp).format()
          const valueTagMessage = ValueTagMessage(tagTempArray, groupId, timestampFormat)
          //client.publish(topic, JSON.stringify(valueTagMessage), { qos: 1, retain: false });
          if (is_connected) {
            let rs = client.publish(topic, JSON.stringify(valueTagMessage), { qos: 1, retain: false });
            if (rs.connected) {
              let time = moment().format("HH:mm:ss")
              console.log(`Event Push Manually Success - time: ${_timestamp}`)
            }
          }
          _timestamp = moment(_timestamp).add(30, "minutes").format("YYYY-MM-DD HH:mm:ss")
          await delay(1500)
        }
      }
      if (keyTime === 'sDate') {
        let tagTempArray = []
        for (let z = 0; z < _allTags.length; z++) {
          let serial = _allTags[z].metter_id.split("_")[1]
          const resultDataByMetter = dataSource.find(({ SO_CTO }) => SO_CTO === serial.toString());
          // console.log("Data: ")
          // console.log(resultDataByMetter)
          let value = (_allTags[z].data_type === "Number") ? parseFloat(resultDataByMetter[_allTags[z].parameter]) : resultDataByMetter[_allTags[z].parameter]
          tagTempArray.push({
            name: `${_allTags[z].metter_id}:${_allTags[z].name}`,
            last_value: value
          })
        }
        const topic = mqttTopicSendata
        let timestampFormat = moment(_timestamp).format()
        const valueTagMessage = ValueTagMessage(tagTempArray, groupId, timestampFormat)
        //client.publish(topic, JSON.stringify(valueTagMessage), { qos: 1, retain: false });
        if (is_connected) {
          let rs = client.publish(topic, JSON.stringify(valueTagMessage), { qos: 1, retain: false });
          if (rs.connected) {
            let time = moment().format("HH:mm:ss")
            console.log(`Event Push Manually Success - time: ${_timestamp}`)
          }
        }
      }
      await delay(5000)
    }
    res.status(200).send({
      code: 200,
      message: "Push Completed!"
    })
  } catch (error) {
    res.status(200).send({
      code: 400,
      error: "Push Failed, cause no data in range time!"
    })
  }
})

//=================Push Manually=================================


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
      await delay(5000)
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
        //let statusDevice = (deltaTime > 7200) ? 0 : 1
        let statusDevice = (filterDataBySerial.length > 0) ? 1 : 0
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

setInterval(CheckDeviceStatus, 5 * 60 * 1000)

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


//========== BackUp Data To Data-Hub==============

async function BackUpMqtt() {
  try {
    const topic = mqttTopicSendata
    if (client?.connected !== true) {
      console.log("No Mqtt Client!")
      return
    }
    if (!is_config) {
      console.log("No Config Tag!")
      return
    }
    const now = moment().format("YYYY-MM-DD HH:mm:ss")
    const allTag = await getMqttTag()
    var result_array_tag_id = [];
    for (var i = 0; i < allTag.length; i++) {
      result_array_tag_id[i] = allTag[i].id;
    }
    let getTimeNeedBackups = await query(`SELECT DISTINCT timestamp  FROM RawData  WHERE tag_id IN (${result_array_tag_id.toString()}) AND is_had_data = 1 AND is_sent = 0 ORDER BY timestamp`)
    //console.log(getTimeNeedBackups)
    if (getTimeNeedBackups.length == 0) {
      console.log("No Data Backup!")
      return
    }
    for (let i = 0; i < getTimeNeedBackups.length; i++) {
      let getDataBackup = await query(`SELECT * FROM RawData WHERE tag_id IN (${result_array_tag_id.toString()}) AND timestamp='${getTimeNeedBackups[i].timestamp}'`)
      let dataBackup = getDataBackup.map(value => {
        return {
          ...value,
          tag_id: value.tag_id,
          name: `${value.metter_id}:${value.tag_name}`,
          last_value: value.value,
          time_in_api_source: getTimeNeedBackups[i].timestamp
        }
      })
      let time = moment(getTimeNeedBackups[i].timestamp).format()
      const valueBackupTagMessage = BackUpValueTagMessage(dataBackup, groupId, time)
      let rs = client?.publish(topic, JSON.stringify(valueBackupTagMessage), { qos: 1, retain: false });
      if (rs?.connected) {
        console.log(`Backup Data Sucessfully with time: ${time}`)
        updateIsSent(dataBackup)
      }
      await delay(2000)
    }
  } catch (error) {
    console.log(error)
    console.log("Push Backup Data Failed!")
  }
}
//Run job every 30 minute
var job30min = new CronJob('*/30 * * * *', async function () {
  console.log("Backuping!")
  await BackUpMqtt()
}, null, true, 'Asia/Ho_Chi_Minh');

job30min.start()

//===================Backup To DataHub============================



