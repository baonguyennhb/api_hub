const express = require('express')
const axios = require('axios').default;
let xmlParser = require('xml2json');
const moment = require('moment')
const port = 4000

const app = express()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

const mqtt = require('mqtt');
const { parseString } = require('xml2js');
var options = {
    port: 1883,
    username: 'Goy2waYPAGQP:n3Q78J2BBKeK',
    password: 'CVemCimzm0duGLr6OnvJ',
};

const client = mqtt.connect("mqtt://rabbitmq-001-pub.hz.wise-paas.com.cn:1883", options);

let dataConfig = {}

let dataConn = {}

let data = {}


const callAPIOld = async () => {
    let startOfDate = moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")
    let params = {
        sNoList: 20698013,
        sTime: startOfDate
    }
    const response = await axios.get('http://14.225.244.63:8083/VendingInterface.asmx/SUNGRP_getInstant', { params })
    let xmlData = response.data
    let jsonData = xmlParser.toJson(xmlData)

    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement.dtResult
    const lastIndex = valueData.length
    const lastData = valueData[lastIndex - 1]
    let dataJson = {
        madiemdo: parseFloat(lastData.MA_DIEMDO),
        socongto: parseFloat(lastData.SO_CTO),
        importkwh: parseFloat(lastData.IMPORT_KWH),
        exportkwh: parseFloat(lastData.EXPORT_KWH),
        importvar: parseFloat(lastData.IMPORT_VAR),
        exportvar: parseFloat(lastData.EXPORT_VAR),
        Ia: parseFloat(lastData.Ia),
        Ib: parseFloat(lastData.Ib),
        Ic: parseFloat(lastData.Ic),
        Ua: parseFloat(lastData.Ua),
        Ub: parseFloat(lastData.Ub),
        Uc: parseFloat(lastData.Uc),
        Cosphi: parseFloat(lastData.Cosphi),
        ngayGio: lastData.NGAYGIO
    }
    return dataJson
}
const callAPI = async () => {
    let startOfDate = moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")
    let params = {
        sNoList: "20698013,20697912,20697917,20697923,20697924,20697927,20697996,20697875,20697666,20697578,20697586,20697594",
        sTime: startOfDate
    }
    const response = await axios.get('http://14.225.244.63:8083/VendingInterface.asmx/SUNGRP_getInstant', { params })
    let xmlData = response.data
    let jsonData = xmlParser.toJson(xmlData)
    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement.dtResult
    const listModel = [20698013, 20697912, 20697917, 20697923, 20697924, 20697927, 20697996, 20697875, 20697666, 20697578, 20697586, 20697594]
    let Val = {}
    for (let i = 0; i < listModel.length; i++) {
        const dataObjectFilterByModel = valueData.filter(value => value.MA_DIEMDO === listModel[i].toString())
        const dataObject = dataObjectFilterByModel[dataObjectFilterByModel.length - 1]
        Val[`${listModel[i]}:MA_DIEMDO`] = parseFloat(dataObject.MA_DIEMDO)
        Val[`${listModel[i]}:SO_CTO`] = parseFloat(dataObject.SO_CTO)
        Val[`${listModel[i]}:IMPORT_KWH`] = parseFloat(dataObject.IMPORT_KWH)
        Val[`${listModel[i]}:EXPORT_KWH`] = parseFloat(dataObject.EXPORT_KWH)
        Val[`${listModel[i]}:IMPORT_VAR`] = parseFloat(dataObject.IMPORT_VAR)
        Val[`${listModel[i]}:EXPORT_VAR`] = parseFloat(dataObject.EXPORT_VAR)
        Val[`${listModel[i]}:Ia`] = parseFloat(dataObject.Ia)
        Val[`${listModel[i]}:Ib`] = parseFloat(dataObject.Ib)
        Val[`${listModel[i]}:Ic`] = parseFloat(dataObject.Ic)
        Val[`${listModel[i]}:Ua`] = parseFloat(dataObject.Ua)
        Val[`${listModel[i]}:Ub`] = parseFloat(dataObject.Ub)
        Val[`${listModel[i]}:Uc`] = parseFloat(dataObject.Uc)
        Val[`${listModel[i]}:Cosphi`] = parseFloat(dataObject.Cosphi)
        Val[`${listModel[i]}:NGAYGIO`] = dataObject.NGAYGIO
    }
    const data = {
        "d": {
            "scada_qQ2N60h1DmL": {
                "Val": Val
            }
        },
        "ts": Date.now()
    }
    return data
}
client.on("connect", ack => {
    try {
        console.log("MQTT Client Connected!")
        dataConn = { "d": { "scada_qQ2N60h1DmL": { "Con": 1 } }, "ts": Date.now() }
        dataConfig = {
            "d": {
                "scada_qQ2N60h1DmL": {
                    "TID": 1,
                    "Dsc": "descrp",
                    "Hbt": 60,
                    "PID": 1,
                    "BID": 0,
                    "UTg": {
                        "20698013:MA_DIEMDO": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:MA_DIEMDO",
                            "TID": 1,
                            "Dsc": "MA_DIEMDO",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:SO_CTO": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:SO_CTO",
                            "TID": 1,
                            "Dsc": "SO_CTO",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:IMPORT_KWH": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:IMPORT_KWH",
                            "TID": 1,
                            "Dsc": "IMPORT_KWH",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:EXPORT_KWH": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:EXPORT_KWH",
                            "TID": 1,
                            "Dsc": "EXPORT_KWH",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:IMPORT_VAR": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:IMPORT_VAR",
                            "TID": 1,
                            "Dsc": "IMPORT_VAR",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:EXPORT_VAR": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:EXPORT_VAR",
                            "TID": 1,
                            "Dsc": "EXPORT_VAR",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:Ia": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:Ia",
                            "TID": 1,
                            "Dsc": "Ia",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:Ib": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:Ib",
                            "TID": 1,
                            "Dsc": "Ib",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:Ic": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:Ic",
                            "TID": 1,
                            "Dsc": "Ic",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:Ua": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:Ua",
                            "TID": 1,
                            "Dsc": "Ua",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:Ub": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:Ub",
                            "TID": 1,
                            "Dsc": "Ub",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:Uc": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:Uc",
                            "TID": 1,
                            "Dsc": "Uc",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:Cosphi": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "20698013:Cosphi",
                            "TID": 1,
                            "Dsc": "Cosphi",
                            "RO": 0,
                            "Ary": 1
                        },
                        "20698013:NGAYGIO": {
                            "Name": "20698013:NGAYGIO",
                            "TID": 3,
                            "Dsc": "NGAYGIO",
                            "RO": 0,
                            "Ary": 1
                        }
                    },
                    // "DTg": {
                    //     "MA_DIEMDO": 1,
                    //     "SO_CTO": 1,
                    //     "IMPORT_KWH": 1,
                    //     "EXPORT_KWH": 1,
                    //     "IMPORT_VAR": 1,
                    //     "EXPORT_VAR": 1,
                    //     "Ia": 1,
                    //     "Ib": 1,
                    //     "Ic": 1,
                    //     "Ua": 1,
                    //     "Ub": 1,
                    //     "Uc": 1,
                    //     "Cosphi": 1,
                    //     "NGAYGIO": 1,
                    //     "ATag1": 1,
                    //     "ATag2": 1,
                    //     "ATag3": 1,
                    //     "ATag4": 1,
                    //     "ATag5": 1,
                    //     "DTag1": 1,
                    //     "DTag2": 1,
                    //     "DTag3": 1,
                    //     "DTag4": 1,
                    //     "DTag5": 1,
                    //     "TTag1": 1,
                    //     "TTag2": 1,
                    //     "TTag3": 1,
                    //     "TTag4": 1,
                    //     "TTag5": 1,
                    // },
                    // "Del": 1
                }
            },
            "ts": Date.now()
        }
        const dataConfig1 = updateTag()
        console.log(dataConfig1)
        client.publish('iot-2/evt/waconn/fmt/scada_qQ2N60h1DmL', JSON.stringify(dataConn))
        console.log("success connect!")
        client.publish('iot-2/evt/wacfg/fmt/scada_qQ2N60h1DmL', JSON.stringify(dataConfig1))
        console.log("success config tag!")
        setInterval(async () => {
            // Call API 
            const { madiemdo, socongto, importkwh, exportkwh, importvar, exportvar, Ia, Ib, Ic, Ua, Ub, Uc, Cosphi, ngayGio } = await callAPI()
            // Data
            // data = {
            //     "d": {
            //         "scada_qQ2N60h1DmL": {
            //             "Val": {
            //                 "20698013:MA_DIEMDO": madiemdo,
            //                 "20698013:SO_CTO": socongto,
            //                 "20698013:IMPORT_KWH": importkwh,
            //                 "20698013:EXPORT_KWH": exportkwh,
            //                 "20698013:IMPORT_VAR": importvar,
            //                 "20698013:EXPORT_VAR": exportvar,
            //                 "20698013:Ia": Ia,
            //                 "20698013:Ib": Ib,
            //                 "20698013:Ic": Ic,
            //                 "20698013:Ua": Ua,
            //                 "20698013:Ub": Ub,
            //                 "20698013:Uc": Uc,
            //                 "20698013:Cosphi": Cosphi,
            //                 "20698013:NGAYGIO": ngayGio
            //             }
            //         }
            //     },
            //     "ts": Date.now()
            // }
            const data = callAPI()
            client.publish('iot-2/evt/wadata/fmt/scada_qQ2N60h1DmL', JSON.stringify(data))
            console.log("Send Data")
        }, 2 * 60 * 1000)
    } catch (error) {
        console.log(error)
    }

})

app.get('/', async (req, res) => {
    let startOfDate = moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")
    let params = {
        sNoList: "20698013,20697912,20697917,20697923,20697924,20697927,20697996,20697875,20697666,20697578,20697586,20697594",
        sTime: startOfDate
    }
    const response = await axios.get('http://14.225.244.63:8083/VendingInterface.asmx/SUNGRP_getInstant', { params })
    let xmlData = response.data
    let jsonData = xmlParser.toJson(xmlData)

    // let dataObjectList = []
    // for (let i = 0; i < listModel.length; i++) {
    //     const dataObjectFilterByModel = valueData.filter(value => value.MA_DIEMDO === listModel[i].toString())
    //     const dataObject = dataObjectFilterByModel[dataObjectFilterByModel.length - 1]
    // }

    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement.dtResult

    const listModel = [20698013, 20697912, 20697917, 20697923, 20697924, 20697927, 20697996, 20697875, 20697666, 20697578, 20697586, 20697594]

    let dataObjectList = []
    for (let i = 0; i < listModel.length; i++) {
        const dataObjectFilterByModel = valueData.filter(value => value.MA_DIEMDO === listModel[i].toString())
        const dataObject = dataObjectFilterByModel[dataObjectFilterByModel.length - 1]
        // const valueModelobject = {
        //     [`${listModel[i]}:MA_DIEMDO`]: madiemdo,
        //     "20698013:SO_CTO": socongto,
        //     "20698013:IMPORT_KWH": importkwh,
        //     "20698013:EXPORT_KWH": exportkwh,
        //     "20698013:IMPORT_VAR": importvar,
        //     "20698013:EXPORT_VAR": exportvar,
        //     "20698013:Ia": Ia,
        //     "20698013:Ib": Ib,
        //     "20698013:Ic": Ic,
        //     "20698013:Ua": Ua,
        //     "20698013:Ub": Ub,
        //     "20698013:Uc": Uc,
        //     "20698013:Cosphi": Cosphi,
        //     "20698013:NGAYGIO": ngayGio
        // }
        // dataObjectList.push(dataObject)
    }
    let UpdateTagList = []
    for (let i = 0; i < listModel.length; i++) {

        // const UpdateTag = {
        //     [`${listModel[i]}:MA_DIEMDO`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:MA_DIEMDO`,
        //         "TID": 1,
        //         "Dsc": "MA_DIEMDO",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:SO_CTO`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:SO_CTO`,
        //         "TID": 1,
        //         "Dsc": "SO_CTO",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:IMPORT_KWH`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:IMPORT_KWH`,
        //         "TID": 1,
        //         "Dsc": "IMPORT_KWH",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:EXPORT_KWH`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:EXPORT_KWH`,
        //         "TID": 1,
        //         "Dsc": "EXPORT_KWH",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:IMPORT_VAR`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:IMPORT_VAR`,
        //         "TID": 1,
        //         "Dsc": "IMPORT_VAR",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:EXPORT_VAR`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:EXPORT_VAR`,
        //         "TID": 1,
        //         "Dsc": "EXPORT_VAR",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:Ia`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:Ia`,
        //         "TID": 1,
        //         "Dsc": "Ia",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:Ib`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:Ib`,
        //         "TID": 1,
        //         "Dsc": "Ib",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:Ic`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:Ic`,
        //         "TID": 1,
        //         "Dsc": "Ic",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:Ua`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:Ua`,
        //         "TID": 1,
        //         "Dsc": "Ua",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:Ub`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:Ub`,
        //         "TID": 1,
        //         "Dsc": "Ub",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:Uc`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:Uc`,
        //         "TID": 1,
        //         "Dsc": "Uc",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:Cosphi`]: {
        //         "Log": 1,
        //         "SH": 1000,
        //         "SL": 0,
        //         "EU": "",
        //         "DSF": "4.2",
        //         "Alm": false,
        //         "Name": `${listModel[i]}:Cosphi`,
        //         "TID": 1,
        //         "Dsc": "Cosphi",
        //         "RO": 0,
        //         "Ary": 1
        //     },
        //     [`${listModel[i]}:NGAYGIO`]: {
        //         "Name": `${listModel[i]}:NGAYGIO`,
        //         "TID": 3,
        //         "Dsc": "NGAYGIO",
        //         "RO": 0,
        //         "Ary": 1
        //     }
        // }
        // UpdateTagList.push(UpdateTag)
    }

    // const lastIndex = valueData.length
    // const lastData = valueData[lastIndex - 1]
    // let dataJson = {
    //     madiemdo: parseFloat(lastData.MA_DIEMDO),
    //     socongto: parseFloat(lastData.SO_CTO),
    //     importkwh: parseFloat(lastData.IMPORT_KWH),
    //     exportkwh: parseFloat(lastData.EXPORT_KWH),
    //     importvar: parseFloat(lastData.IMPORT_VAR),
    //     exportvar: parseFloat(lastData.EXPORT_VAR),
    //     Ia: parseFloat(lastData.Ia),
    //     Ib: parseFloat(lastData.Ib),
    //     Ic: parseFloat(lastData.Ic),
    //     Ua: parseFloat(lastData.Ua),
    //     Ub: parseFloat(lastData.Ub),
    //     Uc: parseFloat(lastData.Uc),
    //     Cosphi: parseFloat(lastData.Cosphi),
    //     ngayGio: lastData.NGAYGIO
    // }
    res.send(updateTag())
})


const updateTag = () => {
    const listModel = [20698013, 20697912, 20697917, 20697923, 20697924, 20697927, 20697996, 20697875, 20697666, 20697578, 20697586, 20697594]

    // let dataObjectList = []
    // for (let i = 0; i < listModel.length; i++) {
    //     const dataObjectFilterByModel = valueData.filter(value => value.MA_DIEMDO === listModel[i].toString())
    //     const dataObject = dataObjectFilterByModel[dataObjectFilterByModel.length - 1]
    // }
    let UpdateTagList = []
    let Utg = {}
    for (let i = 0; i < listModel.length; i++) {


        Utg[`${listModel[i]}:MA_DIEMDO`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:MA_DIEMDO`,
            "TID": 1,
            "Dsc": "MA_DIEMDO",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:SO_CTO`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:SO_CTO`,
            "TID": 1,
            "Dsc": "SO_CTO",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:IMPORT_KWH`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:IMPORT_KWH`,
            "TID": 1,
            "Dsc": "IMPORT_KWH",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:EXPORT_KWH`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:EXPORT_KWH`,
            "TID": 1,
            "Dsc": "EXPORT_KWH",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:IMPORT_VAR`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:IMPORT_VAR`,
            "TID": 1,
            "Dsc": "IMPORT_VAR",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:EXPORT_VAR`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:EXPORT_VAR`,
            "TID": 1,
            "Dsc": "EXPORT_VAR",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Ia`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Ia`,
            "TID": 1,
            "Dsc": "Ia",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Ib`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Ib`,
            "TID": 1,
            "Dsc": "Ib",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Ic`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Ic`,
            "TID": 1,
            "Dsc": "Ic",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Ua`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Ua`,
            "TID": 1,
            "Dsc": "Ua",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Ub`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Ub`,
            "TID": 1,
            "Dsc": "Ub",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Uc`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Uc`,
            "TID": 1,
            "Dsc": "Uc",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Cosphi`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Cosphi`,
            "TID": 1,
            "Dsc": "Cosphi",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:NGAYGIO`] = {
            "Name": `${listModel[i]}:NGAYGIO`,
            "TID": 3,
            "Dsc": "NGAYGIO",
            "RO": 0,
            "Ary": 1
        }

        //UpdateTagList.push(UpdateTag)
    }
    const dataConfig = {
        "d": {
            "scada_qQ2N60h1DmL": {
                "TID": 1,
                "Dsc": "descrp",
                "Hbt": 60,
                "PID": 1,
                "BID": 0,
                "UTg": Utg
            }
        }, "ts": Date.now()
    }
    return dataConfig
}

app.get('/data', async (req, res) => {
    let startOfDate = moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")
    let params = {
        sNoList: "20698013,20697912,20697917,20697923,20697924,20697927,20697996,20697875,20697666,20697578,20697586,20697594",
        sTime: startOfDate
    }
    const response = await axios.get('http://14.225.244.63:8083/VendingInterface.asmx/SUNGRP_getInstant', { params })
    let xmlData = response.data
    let jsonData = xmlParser.toJson(xmlData)
    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement.dtResult
    const listModel = [20698013, 20697912, 20697917, 20697923, 20697924, 20697927, 20697996, 20697875, 20697666, 20697578, 20697586, 20697594]
    let dataObjectList = []
    let Val = {}
    for (let i = 0; i < listModel.length; i++) {
        const dataObjectFilterByModel = valueData.filter(value => value.MA_DIEMDO === listModel[i].toString())
        const dataObject = dataObjectFilterByModel[dataObjectFilterByModel.length - 1]
        Val[`${listModel[i]}:MA_DIEMDO`] = dataObject.MA_DIEMDO
        Val[`${listModel[i]}:SO_CTO`] = dataObject.SO_CTO
        Val[`${listModel[i]}:IMPORT_KWH`] = dataObject.IMPORT_KWH
        Val[`${listModel[i]}:EXPORT_KWH`] = dataObject.EXPORT_KWH
        Val[`${listModel[i]}:IMPORT_VAR`] = dataObject.IMPORT_VAR
        Val[`${listModel[i]}:EXPORT_VAR`] = dataObject.EXPORT_VAR
        Val[`${listModel[i]}:Ia`] = dataObject.Ia
        Val[`${listModel[i]}:Ib`] = dataObject.Ib
        Val[`${listModel[i]}:Ic`] = dataObject.Ic
        Val[`${listModel[i]}:Ua`] = dataObject.Ua
        Val[`${listModel[i]}:Ub`] = dataObject.Ub
        Val[`${listModel[i]}:Uc`] = dataObject.Uc
        Val[`${listModel[i]}:Cosphi`] = dataObject.Cosphi
        Val[`${listModel[i]}:NGAYGIO`] = dataObject.NGAYGIO
    }
    const data = {
        "d": {
            "scada_qQ2N60h1DmL": {
                "Val": Val
            }
        },
        "ts": Date.now()
    }
    res.send(data)
})

