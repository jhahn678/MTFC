const jwt = require('jsonwebtoken');

const generateAdminToken = (id) => {
    return jwt.sign({ admin: id }, process.env.JWT_SECRET, {
        expiresIn: '8h'
    })
}

module.exports = generateAdminToken;