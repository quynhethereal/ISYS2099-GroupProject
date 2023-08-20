const mysql = require('mysql2');
const mongoose = require('mongoose');

// Create connection to mongodb in localhost
const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Check whether connection is valid
mongoose.connect(mongodb_uri)
    .then(() => console.log("Connected to MongoDB database!"))
    .catch((err) => console.log("Fail to connect to MongoDB database...", err));

const CategorySchema = new mongoose.Schema ({
    id: {
        type: Number, 
        required: true, 
        unique: true
    },
    name: {
        type: String, 
        required: true,
        unique: true
    },
    subcat: [Number]
}, {autoIndex: false});

const Category = mongoose.model('Category', CategorySchema);

var Categories = [];

Category.find({})
.then((documents) => {
    if (documents.length == 0) {
        // Dummy data
        Category.insertMany([
            {id: 1, name: 'Clothing and Accessories'},
            {id: 2, name: 'Electronics and Gadgets'},
            {id: 3, name: 'Home and Kitchen Appliances'},
            {id: 4, name: 'Beauty and Personal Care'},
            {id: 5, name: 'Books, Music, and Movies'},
            {id: 6, name: 'Sports and Fitness Equipment'},
            {id: 7, name: 'Toys and Games'},
            {id: 8, name: 'Furniture and Home Decor'},
            {id: 9, name: 'Groceries and Food Items'},
            {id: 10, name: 'Health and Wellness Products'},
            {id: 11, name: 'Automotive and Car Accessories'},
            {id: 12, name: 'Office Supplies and Stationery'},
            {id: 13, name: 'Pet Supplies'},
            {id: 14, name: 'Outdoor and Camping Gear'},
            {id: 15, name: 'Jewelry and Watches'},
            {id: 16, name: 'Baby and Kids Products'},
            {id: 17, name: 'Crafts and DIY Supplies'},
            {id: 18, name: 'Party and Event Supplies'},
            {id: 19, name: 'Travel and Luggage'},
            {id: 20, name: 'Gifts and Novelty Items'}
        ]);
    } else {
        // Create an array to store all the values taken from MongoDB
        Categories.push(documents);
        documents.forEach((document) => {
            // console.log(document);
        })
    }
})
.catch((error) => {
    console.error('Error fetching documents:', error);
});

// Create admin connection pool to the MySQL database
const admin_pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_ADMIN_USER,
    password: process.env.MYSQL_ADMIN_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    debug: false
});

admin_pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

admin_pool.getConnection(function (err, connection) {
    if (err) {
        console.error('Error connecting customer pool to MySQL:', err);
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

// Create a seller connection pool to the MySQL database
const wh_pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_WH_USER,
    password: process.env.MYSQL_WH_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    debug: false
});

wh_pool.getConnection(function (err, connection) {
    if (err) {
        console.error('Error connecting seller to MySQL:', err);
        connection.release();
        throw err;
    }

  console.log('Connected warehouse admin pool to MySQL!');
    connection.on('error', function (err) {
        throw err;
    });
});

module.exports = {Category, admin_pool, customer_pool, seller_pool, wh_pool};

