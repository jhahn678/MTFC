import joi from 'joi'

export const nameSchema = joi.string().trim().min(2).required().messages({
    'string.empty': 'Field is required',
    'any.required': 'Field is required',
    'string.min': 'Field must be at least two characters'
})

export const emailSchema = joi.string().email({tlds: false}).required().messages({
    'string.empty': 'Field is required',
    'any.required': 'Field is required',
    'string.email': 'Must be a valid email'
})

export const passwordSchema =  joi.string().min(8).max(30).required().pattern(/^[a-zA-Z0-9$%#@!]{8,30}$/).messages({
    'string.empty': 'Field is required',
    'any.required': 'Field is required',
    'string.min': 'Password must be at least eight characters',
    'string.max': 'Password cannot be more than 30 characters',
    'string.pattern.base': 'Password may contain alphanumeric characters, and the following symbols: $ % # A !'
})

export const bodySchema = joi.string().trim().min(40).max(1000).required().messages({
    'string.empty': 'Field is required',
    'any.required': 'Field is required',
    'string.min': 'Please tell us a bit more so we can properly answer your question',
    'string.max': 'Question has a 1000 character maximum',
})

export const phoneSchema = joi.number().integer().min(1000000000).max(9999999999).messages({
    'number.min': 'Must be valid 10-digit phone number',
    'number.max': 'Must be valid 10-digit phone number',
    'number.integer': 'Must be valid 10-digit phone number',
    'number.base': 'Must be valid 10-digit phone number',
})