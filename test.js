const sqlite3 = require("sqlite3").verbose()
const path = require("path");
const { promisify } = require("util");

// Create a new database named mydb.sqlite in the root of this project.
const dbFilePath = path.join(__dirname, "Database/api_hub.db");
const db = new sqlite3.Database(dbFilePath);

// Use the promise pattern for SQLite so we don't end up in callback hell.
const query = promisify(db.all).bind(db);
// SQL query for creating a users table if it doesn't already exist.
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    "id" INTEGER PRIMARY KEY,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "created_at" TEXT
  )
`;
// Generate user attributes using faker.
const newUser = {
    email: "bao.nh@gmail.com",
    first_name: "Bao",
    last_name: "Nguyen Huu",
    created_at: Date.now(),
  };
  
  /**
   * Run an INSERT query on some given table and insert the given object.
   */
  const create = async ({ table, object }) => {
    const keys = Object.keys(object).join(",");
    const values = Object.values(object)
      .map((v) => `"${v}"`)
      .join(",");
    const res = await query(`INSERT INTO ${table} (${keys}) VALUES (${values})`);
    return res;
  };
  
  /**
   * Read all records and all their columns from some given table.
   */
  const read = async ({ table }) => {
    const res = await query(`SELECT * FROM ${table}`);
    return res;
  };
  
  /**
   * The main controller of this script. This is inside an async function so we
   * can use the promise pattern.
   */
  const run = async () => {
    // Create users table if it doesn't exist.
    await query(createTableQuery);
    // Create a new user.
    await create({ table: "users", object: newUser });
    // Read all the users.
    const users = await read({ table: "users" });
    // Print to the console.
    console.log(users);
  };
  
  //run();
  const readDat = async() => {
    const users = await read({ table: "Metter" });
    // Print to the console.
    console.log(users);
  }
  readDat()