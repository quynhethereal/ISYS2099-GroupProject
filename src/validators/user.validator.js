// Define an object to hold validation functions
const UserValidator = {};

// Validate username length
const validateUsername = (username) => {
    if (!username || username.length < 3 || username.length > 20) {
        throw new Error('Username must be between 3 and 20 characters');
    }
};

// TODO: NEED CHECKING
// Validate that update timestamp never happens before create timestamp
const validateTime = (created_at, updated_at) => {
    if (created_at < updated_at) {
        throw new Error('User is updated BEFORE created');
    }
};

// TODO: NEED CHECKING
// Validate that first name consist of letters only
const validateFirstname = (first_name) => {
    const letters = /^[A-Za-z]+$/;

    if (!letters.test(first_name)) {
        throw new Error('Invalid first name format');
    }
};

// TODO: NEED CHECKING
// Validate that last name consist of letters only
const validateLastname = (last_name) => {
    const letters = /^[A-Za-z]+$/;

    if (!letters.test(last_name)) {
        throw new Error('Invalid last name format');
    }
};

// TODO: NEED CHECKING
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

// TODO: NEED CHECKING
// Validate that phone number consists of exactly 10 digits
const validatePhone = (phone) => {
    if (!/^[0-9]{10}$/.test(phone)) {
        throw new Error('Phone number must have exactly 10 digits');
    }
};

// TODO: NEED CHECKING
UserValidator.validateUpdateParams = (params) => {
    const { username, created_at, updated_at, first_name, last_name, role, email, phone } = params;

    UserValidator.validateUsername(username);
    UserValidator.validateTime(created_at, updated_at);
    UserValidator.validateFirstname(first_name)
    UserValidator.validateLastname(last_name);
    UserValidator.validateRole(role);
    UserValidator.validateEmail(email);
    UserValidator.validatePhone(phone);
}

// Export the UserValidator object containing all validation functions
module.exports = UserValidator;
