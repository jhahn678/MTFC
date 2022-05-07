const express = require('express')
const router = express.Router()
const Admin = require('../models/admin')
const bcrypt = require('bcrypt')
const AppError = require('../utils/AppError')
const asyncHandler = require('express-async-handler')
const { verifyAdmin } = require('../middleware/auth')
const generateAdminToken = require('../utils/generateAdminToken')

router.post('/auth/login', asyncHandler(async(req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ 'credentials.username': username })
    if(admin && (await bcrypt.compare(password, admin.credentials.password))){
        return res.status(200).json({
            token: generateAdminToken(admin._id)
        })
    }else{
        return res.status(400).json({ message: 'Invalid Credentials' })
    }
}))

router.post('/auth/create-admin', verifyAdmin, asyncHandler(async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;
    const usernameInUse = await Admin.findOne({ 'credentials.username': username })
    if(usernameInUse) return res.status(400).json({ messsage: 'Username already taken' })
    const hash = await bcrypt.hash(password, 10)
    const admin = new Admin({
        credentials: {
            username: username,
            password: hash
        },
        personalDetails: {
            firstName: firstName,
            lastName: lastName,
            email: email
        }
    })
    const newAdmin = await admin.save()
    res.status(200).json({ admin: newAdmin, message: 'New admin created'})
}))