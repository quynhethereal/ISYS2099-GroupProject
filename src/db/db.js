const mysql = require('mysql2');
const mongoose = require('mongoose');

// Create connection to mongodb in localhost
const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Check whether connection is valid
mongodb_connection = mongoose.createConnection(mongodb_uri);
mongodb_connection.on('connected', function (ref) {
  console.log("Connected to MongoDB database!");
});

// Check whether connection is failed
mongodb_connection.on('error', function (err) {
  console.log("Fail to connect to MongoDB database...", err);
});

// Create admin connection pool to the MySQL database
const admin_pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_ADMIN_USER,
    password: process.env.MYSQL_ADMIN_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
    debug: false
});

admin_pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

admin_pool.getConnection(function (err, connection) {
    if (err) {
        console.error('Error connecting admin pool to MySQL:', err);
        connection.release();
        throw err;
    }

    console.log('Connected admin pool to MySQL!');
    connection.on('error', function (err) {
        throw err;
    });
});

// Create a customer connection pool to the MySQL database
const customer_pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_CUSTOMER_USER,
    password: process.env.MYSQL_CUSTOMER_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    debug: false
});

customer_pool.getConnection(function (err, connection) {
    if (err) {
        console.error('Error connecting customer pool to MySQL:', err);
        connection.release();
        throw err;
    }

    console.log('Connected customer pool to MySQL!');
    connection.on('error', function (err) {
        throw err;
    });
});



// Create a seller connection pool to the MySQL database
const seller_pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_SELLER_USER,
  password: process.env.MYSQL_SELLER_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  debug: false
});

seller_pool.getConnection(function (err, connection) {
  if (err) {
      console.error('Error connecting seller to MySQL:', err);
      connection.release();
      throw err;
  }

  console.log('Connected seller pool to MySQL!');
  connection.on('error', function (err) {
      throw err;
  });
});

module.exports = {mongodb_connection, admin_pool, customer_pool, seller_pool};
