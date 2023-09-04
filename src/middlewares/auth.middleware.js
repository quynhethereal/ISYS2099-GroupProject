const jwt = require('jsonwebtoken');
const User = require("../models/user.model");

// verify jwt sent to header with public key
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        res.status(403).send({
            message: "No token provided."
        });
    }

    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            res.status(401).send({
                message: err.message || "Unauthorized."
            });
        }

        const {id, username, firstName, lastName, email, role} = decoded;
        req.currentUser = new User({id, username, firstName, lastName, email, role});

        next();
    });
}

module.exports = exports;
