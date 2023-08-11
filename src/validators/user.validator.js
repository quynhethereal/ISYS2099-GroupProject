// Define an object to hold validation functions
const UserValidator = {};

// Validate username length
const validateUsername = (username) => {
    if (!username || username.length < 3 || username.length > 20) {
        throw new Error('Username must be between 3 and 20 characters');
    }
};

// Validate that update timestamp never happens before before create timestamp
const validateTime = (created_at, updated_at) => {
    if (created_at < updated_at) {
        throw new Error('User is updated BEFORE created');
    }
};

// Validate that names consist of letters only
const validateName = (first_name, last_name) => {
    const letters = /^[A-Za-z]+$/;

    if (!letters.test(first_name) || !letters.test(last_name)) {
        throw new Error('Invalid name format');
    }
};

// Validate that the provided role is one of the valid roles in the database
const validateRole = (role) => {
    const validRoles = ["customer", "seller", "admin"];

    if (!validRoles.includes(role)) {
        throw new Error('Invalid role');
    }
};

// Validate email format
const validateEmail = (email) => {
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
        throw new Error('Invalid email format');
    }
};

// Validate that phone consists of numbers only
const validatePhone = (phone) => {
    if (!/^[0-9]+$/.test(phone)) {
        throw new Error('Invalid phone format');
    }
};

// Export the UserValidator object containing all validation functions
module.exports = UserValidator;
