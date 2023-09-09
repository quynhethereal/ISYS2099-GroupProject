const User = require("../models/user.model");

// find user by username and password
exports.findByUsernamePassword = async (req, res) => {
    try {
        const user = await User.findByUsernamePassword(req.body.username, req.body.password);

        if (user) {
            res.send(user);
        } else {
            res.status(401).send({
                message: "Unauthorized"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Error retrieving user."
        });
    }
};

// get all users
exports.findAll = async (req, res) => {
    res.status(200).send({
        message: "Success"
    });
}
