
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


dotenv.config();

const dbConfig = require('./src/db/db');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const port = process.env.NODE_PORT || 3000;
app.listen(port);

module.exports = app;