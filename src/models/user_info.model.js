const connection = require("../db/db");
const Helpers = require('../helpers/helpers');
// UserModel model
const UserInfo = function(userInfo){
    //TODO
}

UserInfo.findByUserId = (userId, result) => {
    connection.execute(
        'SELECT * FROM `users_info` WHERE user_id = ?',
        [userId],
        (err, results) => {
            if (err){
                console.log('Unable to find user info.');
                return result(err, null);
            }

            if (results.length ===0) {
                console.log('No user info with this user id.');
                return result(null, null);
            }

            const userInfo = results[0];
            return result(null, userInfo);
        }
    )
}

module.exports = UserInfo;


