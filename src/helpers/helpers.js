const crypto= require('crypto');

const Helpers =  {};

// func to create a randomly salted hash
Helpers.createHash = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

module.exports = Helpers;