const mysql = require('mysql2');

// Create a admin connection pool to the MySQL database
var admin_pool      =    mysql.createPool({
  connectionLimit : 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_ADMIN_USER,
  password : process.env.MYSQL_ADMIN_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  debug    :  false
}); 

admin_pool.getConnection(function(err,connection){
  if (err) {
    console.error('Error connecting admin to MySQL:', err);
    connection.release();
    throw err;
  }   

  console.log('Connected admin to MySQL:', err);
  connection.on('error', function(err) {      
        throw err;
        return;     
  });
});

module.exports = admin_pool;