const {admin_pool} = require("../db/db");
const Helpers = require('../helpers/helpers');
// UserModel model

class User {
    constructor(params) {
        this.username = params.username;
        this.firstName = params.firstName;
        this.lastName = params.lastName;
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
};


module.exports = User;
