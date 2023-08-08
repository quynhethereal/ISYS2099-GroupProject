const User = require("../models/user.model");

// find user by username and password
exports.findByUsernamePassword = (req, res) => {
    User.findByUsernamePassword(
        req.body.username,
        req.body.password,
        (err, user) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Error retrieving user."
                });
            } else {
                res.send(user);
            }
        }
    );
}