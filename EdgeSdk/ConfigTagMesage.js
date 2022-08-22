const ConfigTagMessage = (groupId, tags) => {
    let d = {}
    let Utg = {}
    for (let i = 0; i < tags.length; i++) {
        tag_type = tags[i].tag_type
        Utg[`${tags[i].name}`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${tags[i].name}`,
            "TID": 1,
            "Dsc": `${tags[i].description}`,
            "RO": 0,
            "Ary": 1
        }
        // Utg[`${listModel[i]}:NGAYGIO`] = {
        //     "Name": `${listModel[i]}:NGAYGIO`,
        //     "TID": 3,
        //     "Dsc": "NGAYGIO",
        //     "RO": 0,
        //     "Ary": 1
        // }
    }
    d[`${groupId}`] = {
        "TID": 1,
        "Dsc": "descrp",
        "Hbt": 60,
        "PID": 1,
        "BID": 0,
        "UTg": Utg
    }
    const dataConfig = {
        "d": d,
        "ts": new Date().toISOString()
    }
    return dataConfig
}
 module.exports = ConfigTagMessage