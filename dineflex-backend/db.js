const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "madhu@12345",
  database: "dineflex"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed", err);
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;