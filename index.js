const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const multer = require('multer');

const authMiddleware = require('./src/middlewares/auth.middleware');
const dbConfig = require('./src/db/db');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const port = process.env.NODE_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

require("./src/routes/routes")(app);


module.exports = app;