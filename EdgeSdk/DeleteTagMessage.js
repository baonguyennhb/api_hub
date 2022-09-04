const DeleteTag = (tag, groupId, heatbeat) => {
    let d = {}
    let DTg = {}
    DTg[`${tag.name}`] = 1
    d[`${groupId}`] = {
        "TID": 1,
        "Dsc": tag.name,
        "Hbt": heatbeat,
        "PID": 1,
        "BID": 0,
        "DTg": DTg,
        "Del": 1
    }
    const dataConfig = {
        "d": d,
        "ts": new Date().toISOString()
    }
    return dataConfig
}

const DeleteAllTag = (tags, groupId, heatbeat) => {
    let d = {}
    let DTg = {}
    for (let i = 0; i < tags.length; i++) {
        DTg[`${tags[i].name}`] = 1
        d[`${groupId}`] = {
            "TID": 1,
            // "Dsc": tags[i].name,
            "Hbt": heatbeat,
            "PID": 1,
            "BID": 0,
            "DTg": DTg,
        }
    }
    const dataConfig = {
        "d": d,
        "ts": new Date().toISOString()
    }
    return dataConfig
}

module.exports = {
    DeleteTag: DeleteTag,
    DeleteAllTag: DeleteAllTag
}

