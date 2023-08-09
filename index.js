const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = require('./src/db/db');
const authMiddleware = require('./src/middlewares/auth.middleware');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const port = process.env.NODE_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

require("./src/routes/routes")(app);


module.exports = app;