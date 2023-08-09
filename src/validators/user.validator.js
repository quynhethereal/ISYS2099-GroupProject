const UserValidator = {};

const validateUsername = (username) => {
    if (!username || username.length < 3 || username.length > 20) {
        throw new Error('Username must be between 3 and 20 characters');
    }
};

const validateEmail = (email) => {
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
        throw new Error('Invalid email format');
    }
};


module.exports = UserValidator;