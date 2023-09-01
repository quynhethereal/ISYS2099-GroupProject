const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

require('multer');
require('./src/middlewares/auth.middleware');
require('./src/db/db');

const {generateSeedData, dropCollection} = require('./src/db/mongo.seed');

// ---- uncomment to drop categories collection ----
// dropCollection().then(() => {
//     console.log('Categories collection dropped');

// }).catch((err) => {
//     console.log('Error dropping categories collection:', err);
// });
generateSeedData().then(() => {
    console.log('Seed data for mongoDB generated.');
}).catch((err) => {
    console.log('Error generating seed data:', err);
});

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const port = process.env.NODE_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

require("./src/routes/routes")(app);


module.exports = app;