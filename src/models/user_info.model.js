const {admin_pool} = require("../db/db");
// UserModel model
const UserInfo = function (userInfo) {

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
