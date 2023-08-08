const connection = require("../db/db");
const Helpers = require('../helpers/helpers');
// UserModel model
const User = function(user){
    this.username = user.username;
    this.password = Helpers.createHash(user.password);
}

User.findByUsernamePassword = (username, password, result) => {
    connection.execute(
        'SELECT * FROM `users` WHERE username = ?',
        [username],
        (err, results) => {
            if (err){
                console.log('Unable to find user.');
                return result(err, null);
            }

            if (results.length ===0) {
                console.log('No user with this username.');
                return result(null, null);
            }

            const user = results[0];
            const hashedPassword = Helpers.createHash(password, user.salt_value);

            console.log(hashedPassword.hash);
            console.log(user.password);
            if (hashedPassword.hash === user.hashed_password) {
                console.log("User found.");
                return result(null, user);
            } else {
                console.log("Incorrect password.");
                return result(null, null);
            }
        }
    )
}

module.exports = User;
