const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { userSchema } = require('../joi/joiSchemas')
const generateAuthToken = require('../utils/generateAuthToken')
const asyncHandler = require('express-async-handler')
const validateUserShoppingCart = require('../utils/validateUserShoppingCart')
const AppError = require('../utils/AppError')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email)
    if(user && (await bcrypt.compare(password, user.account.password))){
        if(user.cart){
            const { cart, cartModified } = await validateUserShoppingCart(user)
            return res.status(200).json({
                firstName: user.account.firstName,
                userId: user._id,
                token: generateAuthToken(user._id),
                cart: cart,
                cartModified: cartModified
            })
        }
        //No cart exists
        res.status(200).json({
            firstName: user.account.firstName,
            userId: user._id,
            token: generateAuthToken(user._id)
        })
    }else{
        throw new AppError('Invalid credentials', 400)
    }
}))

router.post('/register', asyncHandler(async (req, res) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false})
    if(error) {
        const errorMessages = error.details.map((obj) => obj.message)
        throw new AppError(errorMessages, 406)
    }
    const { firstName, lastName, email, password } = req.body;
    if (await User.findByEmail(email)){
        throw new AppError('Email already in use', 409)
    }
    const hash = await bcrypt.hash(password, 10)
    const newUser = new User({
        account:{
            firstName,
            lastName,
            email,
            password: hash
        }
    })
    await newUser.save()
    res.status(201).json({
        userId: newUser._id,
        firstName: newUser.account.firstName,
        token: generateAuthToken(newUser._id)
    })
}))

router.post('/google', asyncHandler(async (req, res) => {
    const { token } = req.body;
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const { sub: googleId, email, given_name: firstName, family_name: lastName, picture } = ticket.getPayload()
        const user = await User.findOne({ 'account.googleId': googleId })
        if(user && user.cart){
            const { cart, cartModified } = await validateUserShoppingCart(user)
            res.status(200).json({
                userId: user._id,
                firstName: user.account.firstName,
                token: generateAuthToken(user._id),
                cart: cart,
                cartModified: cartModified
            })
        }else if(user){
            res.status(200).json({
                userId: user._id,
                firstName: user.account.firstName,
                token: generateAuthToken(user._id)
            })
        }else{
            const createUser = new User({
                account: {
                    firstName,
                    lastName,
                    email,
                    googleId,
                    picture
                }
            })
            const newUser = await createUser.save()
            res.status(201).json({
                userId: newUser._id,
                firstName: newUser.account.firstName,
                token: generateAuthToken(newUser._id)
            })
        }
    }
    catch(err){
        console.log(err)
        throw new AppError('Could not authenticate', 400)
    }
}))

module.exports = router;