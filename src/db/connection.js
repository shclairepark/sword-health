"use strict";
const mysql = require("mysql");
require("dotenv").config();

const dbConn = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.MYSQLDB_DOCKER_PORT || "3306",
  user: process.env.MYSQLDB_USER || "root",
  password: process.env.MYSQLDB_ROOT_PASSWORD || "ms1234",
  database: process.env.MYSQLDB_DATABASE || "sword_db",
});
dbConn.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});
module.exports = dbConn;
