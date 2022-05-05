const joi = require('joi')

const userSchema = joi.object({
    firstName: 
        joi.string()
        .min(2)
        .required(),
    lastName: 
        joi.string()
        .min(2)
        .required(),
    email: joi.string()
        .email()
        .required(),
    password: joi.string()
        .trim()
        .min(8)
        .required()
        .pattern(/^[a-zA-Z0-9$%#@!]{3,30}$/),
    passwordConfirm: joi.string()
        .required()
        .valid(joi.ref('password'))
})

module.exports = { userSchema }