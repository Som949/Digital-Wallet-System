import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Mysql@123",
  database: "mysql_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// export const db = await mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "MySql@123",
//     database: "mysql_db"
// });

console.log("Database Connected Successfully");

    
