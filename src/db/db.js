const mysql = require('mysql2');

// // Create a admin connection pool to the MySQL database
// var admin_pool      =    mysql.createPool({
//   connectionLimit : 10,
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_ADMIN_USER,
//   password : process.env.MYSQL_ADMIN_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   debug    :  false
// }); 

// admin_pool.getConnection(function(err,connection){
//   if (err) {
//     console.error('Error connecting admin to MySQL:', err);
//     connection.release();
//     throw err;
//   }   

//   console.log('Connected admin to MySQL:', err);
//   connection.on('error', function(err) {      
//         throw err;
//         return;     
//   });
// });

// module.exports = admin_pool;

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,       // MySQL server hostname
  user: process.env.MYSQL_USERNAME,    // MySQL username
  password: process.env.MYSQL_PASSWORD, // MySQL password
  database: process.env.MYSQL_DATABASE // MySQL database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting admin to MySQL:', err);
    connection.release();
    throw err;
  }   

module.exports = connection;

// Close the connection when done
connection.end((err) => {
  if (err) {
    console.error('Error closing MySQL connection:', err);
    return;
  }
  console.log('MySQL connection closed');

});

module.exports = admin_pool;