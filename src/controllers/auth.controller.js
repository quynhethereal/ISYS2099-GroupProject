const User = require("../models/user.model");
const UserInfo = require("../models/user_info.model");
const jwt = require('jsonwebtoken');

// 90 days
const privateKey = process.env.PRIVATE_KEY;

exports.authenticate = (req, res) => {
    User.findByUsernamePassword(req.body.username, req.body.password, (err, user) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Error retrieving user."
            });
        } else {
            if (user) {
                // fetch the associated user info
                UserInfo.findByUserId(user.id, (err, userInfo) => {
                    if (err) {
                        res.status(500).send({
                            message: err.message || "Error retrieving user info."
                        });
                    } else {
                        if (userInfo) {
                            // for demo purposes, the expiration is set to 90 days
                            const token = jwt.sign({
                                username: user.username,
                                firstName: userInfo.first_name,
                                lastName: userInfo.last_name,
                                email: userInfo.email,
                                role: null
                            }, privateKey, {expiresIn: '90d'});
                            res.send({token: token});
                        } else {
                            res.status(500).send({
                                message: "Error retrieving user info."
                            });
                        }
                    }
                });
            } else {
                res.status(401).send({
                    message: "Unauthorized"
                });
            }
        }
    });
}