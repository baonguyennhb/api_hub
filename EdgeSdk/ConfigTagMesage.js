const ConfigTagMessage = (groupId, tags, tag_deletes) => {
    let d = {}
    let Utg = {}
    let DTg = {}
    for (let i = 0; i < tags.length; i++) {
        tag_type = tags[i].tag_type
        if (tag_type === "Analog") {
            Utg[`${tags[i].name}`] = {
                "Log": 1,
                "SH": 1000,
                "SL": 0,
                "EU": "",
                "DSF": "4.2",
                "Alm": false,
                "Name": `${tags[i].name}`,
                "TID": 1,
                "Dsc": `${tags[i].name}`,
                "RO": 0,
                "Ary": 1
            }
        } else if (tag_type === "Text") {
            Utg[`${tags[i].name}`] = {
                "Name": `${tags[i].name}`,
                "TID": 3,
                "Dsc": `${tags[i].name}`,
                "RO": 0,
                "Ary": 1
            }
        }
    }
    for (let i = 0; i < tag_deletes.length; i++) {
        DTg[`${tag_deletes[i].name}`] = 1
    }
    d[`${groupId}`] = {
        "TID": 1,
        "Dsc": "descrp",
        "Hbt": 5,
        "PID": 1,
        "BID": 0,
        "Del": 1,
        "DTg": DTg,
        "UTg": Utg,
    }
    const dataConfig = {
        "d": d,
        "ts": new Date().toISOString()
    }
    return dataConfig
}
module.exports = ConfigTagMessage