const {admin_pool} = require("../db/db");
const Helpers = require('../helpers/helpers');

// UserModel model

const UserInfo = function(userInfo){
    // TODO: NEED CHECKING
    this.first_name = userInfo.first_name;
    this.last_name = userInfo.last_name;
    this.role = userInfo.role;
    this.email = userInfo.email;
    this.phone = userInfo.phone;
}

UserInfo.findByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        admin_pool.execute(
            'SELECT * FROM `users_info` WHERE user_id = ?',
            [userId],
            (err, results) => {
                if (err) {
                    console.log('Unable to find user info.');
                    reject(err);
                    return;
                }

                if (results.length === 0) {
                    console.log('No user info with this user id.');
                    resolve(null);
                    return;
                }

                const userInfo = results[0];
                resolve(userInfo);
            }
        );
    });
};


module.exports = UserInfo;


