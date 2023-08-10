const mysql = require('mysql2');

// Create a admin connection pool to the MySQL database
const admin_pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_ADMIN_USER,
    password: process.env.MYSQL_ADMIN_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    debug: false
});

module.exports = admin_pool;

// Create a customer connection pool to the MySQL database
const customer_pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_CUSTOMER_USER,
  password: process.env.MYSQL_CUSTOMER_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  debug: false
});

// customer_pool.getConnection(function (err, connection) {
//   if (err) {
//       console.error('Error connecting customer pool to MySQL:', err);
//       connection.release();
//       throw err;
//   }
//
//   console.log('Connected customer pool to MySQL!');
//   connection.on('error', function (err) {
//       throw err;
//   });
// });

// module.exports = customer_pool;

// Create a seller connection pool to the MySQL database
const seller_pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_SELLER_USER,
  password: process.env.MYSQL_SELLER_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  debug: false
});

// seller_pool.getConnection(function (err, connection) {
//   if (err) {
//       console.error('Error connecting seller to MySQL:', err);
//       connection.release();
//       throw err;
//   }
//
//   console.log('Connected seller pool to MySQL!');
//   connection.on('error', function (err) {
//       throw err;
//   });
// });

// module.exports = seller_pool;
