const crypto= require('crypto');
const fs = require('fs');
const atob = require('atob');
const Blob = require('node-blob');
const Helpers =  {};

// func to create a randomly salted hash
Helpers.createHash = (password,salt) => {
    salt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

Helpers.encodeImage = (file) => {
    const bitmap = fs.readFileSync(file).toString('base64');
    return new Buffer.from(bitmap).toString();
}

Helpers.decodeImage = (base64str,file) => {
    const base64 = new Buffer.from(base64str, 'base64');
    fs.writeFileSync(file, base64);
}

module.exports = Helpers;
