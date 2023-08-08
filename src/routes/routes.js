module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const auth = require("../controllers/auth.controller.js");

    let router = require("express").Router();
    // authenticate a user
    router.post("/auth", auth.authenticate);


    // get a user by username and password
    router.post("/user", users.findByUsernamePassword);

    app.use('/api', router);
}