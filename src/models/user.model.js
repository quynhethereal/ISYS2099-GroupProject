const connection = require("../db/db");
const Helpers = require('../helpers/helpers');
// UserModel model
const User = function(user){
    this.username = user.username;
    this.password = createHash(user.password);
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
            const hashedPassword = Helpers.createHash(password, user.salt);

            if (hashedPassword.hash !== user.password) {
                return result(null, user);
            }
        }
    )
}

module.exports = User;
