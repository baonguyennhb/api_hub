const common = require('../Common/query')
const query = common.query

module.exports.GetDetail = async (req, res) => {
    try {
        let sql = 'SELECT * FROM DataHub'
        const data_hub = await query(sql)
        const dataSend = {
            code: 200,
            message: "OK",
            data: data_hub[0]
        }
        res.status(200).send(dataSend)
    } catch (error) {
        console.log(error)
    }
}

module.exports.postEdit = async (req, res) => {
    try {
        let data = req.body
        console.log(req.query)
        let sql = `UPDATE DataHub SET node_id = '${data.nodeId}', host = '${data.host}', port = '${data.port}', username = '${data.username}', password = '${data.password}' interval = '${data.interval}'`
        const data_hub = await query(sql)
        const dataSend = {
            code: 200,
            message: "OK",
            data: data_hub
        }
        res.status(200).send(dataSend)
    } catch (error) {
        console.log(error)
    }
}
module.exports.AddTag = async (req, res) => {
    try {
        const tagList = req.body.tags
        // console.log(tagList)
        // const tagsInMqttTagTable = await query("SELECT * FROM MqttTag")
        // const diffId = tagList.filter(({ id: id1 }) => !tagsInMqttTagTable.some(({ id: id2 }) => id2 === id1));
        // console.log(diffId)
        // for (let i = 0; i < diffId.length; i++) {
        //     tagId = diffId[i]?.id
        //     let tagFromTagTable = await query(`SELECT * FROM Tag WHERE id='${tagId}'`)
        //     let type = tagFromTagTable[0].data_type === "Number" ? "Analog" : "Text"
        //     let addTagToMqttTagTable = await query(`INSERT INTO MqttTag( id, name, tag_type ) VALUES ( ${tagFromTagTable[0].id} , '${tagFromTagTable[0].metter_id}:${tagFromTagTable[0].name}', '${type}') `)
        // }
        let deleteAllMqttTag = await query("DELETE FROM MqttTag")
        for (let i = 0; i < tagList.length; i++) {
            tagId = tagList[i]?.id
            let tagFromTagTable = await query(`SELECT * FROM Tag WHERE id='${tagId}'`)
            let type = tagFromTagTable[0].data_type === "Number" ? "Analog" : "Text"
            let addTagToMqttTagTable = await query(`INSERT INTO MqttTag( id, name, tag_type ) VALUES ( ${tagFromTagTable[0].id} , '${tagFromTagTable[0].metter_id}:${tagFromTagTable[0].name}', '${type}') `)
        }
        let dataSend = {
            "code": 200,
            "message": "OK",
            "data": "Add Tag Successfully"
        }
        res.status(200).send(dataSend)
    } catch (error) {
        if (error.errno === 19) {
            res.status(200).send({
                "code": 400,
                "message": "Error",
                "error": "Tag have existed"
            })
        }
    }
}
module.exports.GetListTag = async (req, res) => {
    try {
        const sql = "SELECT * FROM MqttTag"
        const tags = await query(sql)
        const dataSend = {
            "code": 200,
            "message": "OK",
            "data": tags
        }
        res.status(200).send(dataSend)
    } catch (error) {

    }
}

module.exports.DelAll = async (req, res) => {
    try {
        const sql = "DELETE FROM MqttTag"
        const tags = await query(sql)
        const dataSend = {
            "code": 200,
            "message": "OK",
            "data": "Delete Sucessfully!"
        }
        res.status(200).send(dataSend)
    } catch (error) {
        console.log(error)
    }
}




