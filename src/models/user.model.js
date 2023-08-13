const {admin_pool} = require("../db/db");
const Helpers = require('../helpers/helpers');
const userValidator = require('../validators/user.validator');
// UserModel model

class User {
    constructor(params) {
        this.username = params.username;
        this.first_name = params.first_name;
        this.last_name = params.last_name;
        this.email = params.email;
        this.role = params.role;
    }
}

User.findByUsernamePassword = (username, password) => {
    // console.log(username, password);
    // console.log(admin_pool)
    return new Promise((resolve, reject) => {
        admin_pool.execute(
            'SELECT * FROM `users` WHERE username = ?',
            [username],
            function(err, results) {
                if (err) {
                    console.log('Unable to find user.');
                    reject(err);
                    return;
                }

                if (results.length === 0) {
                    console.log('No user with this username.');
                    resolve(null);
                    return;
                }

                const user = results[0];
                const hashedPassword = Helpers.createHash(password, user.salt_value);

                if (hashedPassword.hash === user.hashed_password) {
                    console.log("User found.");
                    resolve(user);
                } else {
                    console.log("Incorrect password.");
                    resolve(null);
                }
            }
        );
    });
}

// TODO: NEED CHECKING
User.updateFirstName = (params) => {
    const {first_name, username, hashed_password} = params;

    User.findByUsernamePassword(username, hashed_password).then((user) => {
        if (!user) {
            console.log("User not found.");
            return;
        }

        admin_pool.execute(
            'UPDATE `users_info` SET first_name = ? WHERE username = ?',
            [first_name, username],
            (err, results) => {
                if (err) {
                    console.log('Unable to update user.');
                    return;
                }
                console.log("User updated.");
                return results;
            }
        );
    });
}

// TODO: NEED CHECKING
User.updateLastName = (params) => {
    const {last_name, username, hashed_password} = params;

    User.findByUsernamePassword(username, hashed_password).then((user) => {
        if (!user) {
            console.log("User not found.");
            return;
        }

        admin_pool.execute(
            'UPDATE `users_info` SET first_name = ? WHERE username = ?',
            [last_name, username],
            (err, results) => {
                if (err) {
                    console.log('Unable to update user.');
                    return;
                }
                console.log("User updated.");
                return results;
            }
        );
    });
}

// TODO: NEED CHECKING
User.updateEmail = (params) => {
    const {email, username, hashed_password} = params;

    User.findByUsernamePassword(username, hashed_password).then((user) => {
        if (!user) {
            console.log("User not found.");
            return;
        }

        admin_pool.execute(
            'UPDATE `users_info` SET first_name = ? WHERE username = ?',
            [email, username],
            (err, results) => {
                if (err) {
                    console.log('Unable to update user.');
                    return;
                }
                console.log("User updated.");
                return results;
            }
        );
    });
}

module.exports = User;
