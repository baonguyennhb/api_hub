const sqlite3 = require("sqlite3").verbose()
const path = require("path");
const { promisify } = require("util");

// Create a new database named mydb.sqlite in the root of this project.
const dbFilePath = path.join(__dirname, "../Database/api_hub.db");
const db = new sqlite3.Database(dbFilePath);

// Use the promise pattern for SQLite so we don't end up in callback hell.
module.exports.query = promisify(db.all).bind(db);