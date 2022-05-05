const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    credentials: {
        username: String,
        password: String
    },
    personalDetails: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        dateOfBirth: String,
    },
    companyDetails: {
        position: String,
        dateOfHire: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Admin', adminSchema)