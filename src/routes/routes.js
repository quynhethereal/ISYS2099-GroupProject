module.exports = app => {
    const users = require("../controllers/user.controller.js");

    let router = require("express").Router();
    // get a user by username and password
    router.post("/user", users.findByUsernamePassword);

    app.use('/api', router);
}