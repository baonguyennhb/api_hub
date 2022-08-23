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

const DeleteAllTag = (groupId, heatbeat) => {
    let d = {}
    d[`${groupId}`] = {
        "TID": 1,
        "Hbt": heatbeat,
        "PID": 1,
        "BID": 0,
        "Del": 1
    }
    const dataConfig = {
        "d": d,
        "ts": new Date().toISOString()
    }
    return dataConfig
}

module.exports = {
    DeleteTag: DeleteTag,
    DeleteAllTag : DeleteAllTag
}

