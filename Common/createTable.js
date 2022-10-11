const common = require('../Common/query')
const query = common.query

const createTableDataHub = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS "DataHub" (
        "id"	INTEGER NOT NULL,
        "group_id"	TEXT NOT NULL,
        "host"	TEXT NOT NULL,
        "port"	INTEGER NOT NULL,
        "username"	TEXT NOT NULL,
        "password"	TEXT NOT NULL,
        "interval"	INTEGER,
        "heart_beat"	INTEGER,
        "status"	INTEGER,
        PRIMARY KEY("id" AUTOINCREMENT)
    );`
    await query(createTableQuery)
}

const createTableApiSource = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS "ApiSource" (
        "id"	INTEGER NOT NULL,
        "connection_name"	TEXT NOT NULL,
        "url"	TEXT NOT NULL,
        "description"	TEXT,
        "connection_time"	INTEGER,
        "interval"	INTEGER,
        "status"	INTEGER,
        "time_offset"	INTEGER,
        "is_authorization"	INTEGER,
        "username"	TEXT,
        "password"	TEXT,
        "is_active"	INTEGER DEFAULT 1,
        "paras_timestamp"	TEXT,
        "paras_metter_serial"	TEXT,
        "key_time"	TEXT,
        PRIMARY KEY("id" AUTOINCREMENT)
    );`
    await query(createTableQuery)
}

const createTableMetter = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS "Metter" (
        "id"	INTEGER NOT NULL UNIQUE,
        "api_source"	INTEGER,
        "metter_id"	TEXT NOT NULL,
        "serial"	INTEGER NOT NULL,
        "description"	TEXT,
        "interval"	INTEGER,
        "status"	INTEGER,
        PRIMARY KEY("id" AUTOINCREMENT)
    );`
    await query(createTableQuery)
}

const createTableTag = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS "Tag" (
        "id"	INTEGER NOT NULL,
        "api_source"	INTEGER,
        "metter_id"	INTEGER,
        "name"	TEXT NOT NULL,
        "parameter"	TEXT,
        "data_type"	TEXT,
        "scale"	INTEGER DEFAULT 1,
        "send"	INTEGER DEFAULT 1,
        "note"	TEXT,
        "last_value"	TEXT,
        "timestamp"	TEXT,
        "time_in_api_source"	TEXT,
        PRIMARY KEY("id" AUTOINCREMENT)
    );`
    await query(createTableQuery)
}

const createTableMqttTag = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS "MqttTag" (
        "id"	INTEGER NOT NULL UNIQUE,
        "name"	TEXT NOT NULL UNIQUE,
        "tag_type"	TEXT,
        "deadband"	INTEGER,
        "span_high"	INTEGER,
        "span_low"	INTEGER,
        "decimal_digits"	INTEGER,
        "description"	TEXT,
        "is_active"	INTEGER DEFAULT 0,
        PRIMARY KEY("id" AUTOINCREMENT)
    );`
    await query(createTableQuery)
}

const createTableRawData = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS "RawData" (
        "id"	INTEGER NOT NULL,
        "timestamp"	TEXT NOT NULL,
        "api_source"	INTEGER,
        "metter_id"	TEXT,
        "tag_id"	INTEGER NOT NULL,
        "serial"	INTEGER,
        "param"	TEXT,
        "tag_name"	TEXT,
        "value"	INTEGER,
        "is_had_data"	INTEGER DEFAULT 0,
        "is_sent"	INTEGER DEFAULT 0,
        "time_check"	INTEGER DEFAULT 0,
        PRIMARY KEY("id" AUTOINCREMENT),
        UNIQUE("timestamp","tag_id")
    );`
    await query(createTableQuery)
}
const createTableProfileConfig = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS "ProfileConfig" (
        "id"	INTEGER NOT NULL UNIQUE,
        "name"	TEXT NOT NULL,
        "tag_type"	TEXT
    );`
    await query(createTableQuery)
}

const createTableUser = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS "users" (
        "id"	INTEGER,
        "username"	TEXT NOT NULL,
        "name"	TEXT,
        "password"	TEXT,
        "created_at"	TEXT,
        PRIMARY KEY("id" AUTOINCREMENT)
    );`
    await query(createTableQuery)
}

module.exports = {
    createTableDataHub,
    createTableApiSource,
    createTableMetter,
    createTableTag,
    createTableMqttTag,
    createTableRawData,
    createTableProfileConfig,
    createTableUser
}