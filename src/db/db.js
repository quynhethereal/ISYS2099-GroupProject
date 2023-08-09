const mysql = require("mysql2");

// Create a admin connection pool to the MySQL database
const admin_pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_ADMIN_USER,
  password: process.env.MYSQL_ADMIN_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Connect admin to the database
let queryString = `SELECT * FROM ${process.env.MYSQL_HOST}`;
admin_pool.query(queryString, (err) => {
  if (err) {
    console.error("Error connecting admin to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// module.exports = admin_pool;

// Connect customer to the database
// Create a customer connection pool to the MySQL database
const customer_pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_CUSTOMER_USER,
  password: process.env.MYSQL_CUSTOMER_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

customer_pool.query(queryString, (err) => {
  if (err) {
    console.error("Error connecting customer to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = customer_pool;

// Connect seller to the database
// Create a customer connection pool to the MySQL database
const seller_pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_SELLER_USER,
  password: process.env.MYSQL_SELLER_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

seller_pool.query(queryString, (err) => {
  if (err) {
    console.error("Error connecting seller to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});
