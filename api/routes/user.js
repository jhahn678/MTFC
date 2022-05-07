const express = require('express')
const router = express.Router()
const User = require('../models/user')
const AppError = require('../utils/AppError')
const asyncHandler = require('express-async-handler')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

router.get('/', verifyAdmin, asyncHandler(async(req, res) => {
    const allUsers = await User.find()
    res.status(200).json(allUsers)
}))

router.get('/:id', verifyToken, asyncHandler(async(req, res) => {
    const { id } = req.params
    if(req.user !== id) throw new AppError('Unauthorized', 401)
    const user = await User.findById(id).populate('orders')
    if(!user) throw new AppError('User does not exist', 400)
    res.status(200).json(user)
}))

router.patch('/:id', verifyToken, asyncHandler(async(req, res) => {
    const { id } = req.params;
    if(req.user !== id) throw new AppError('Unauthorized', 401)
    const { ...patch } = req.body
    console.log(patch)
    const user = await User.findByIdAndUpdate(id, patch, {new: true})
    if(!user) throw new AppError('Update unsuccessful', 500)
    res.status(200).json(user)
}))

router.get('/:id/cart', verifyToken, asyncHandler(async(req, res) => {
    const { id } = req.params;
    if(req.user !== id) throw new AppError('Unauthorized', 401)
    const user = await User.findById(id).populate('cart')
    if(!user) throw new AppError('User does not exist', 400)
    res.status(200).json(user)
}))

router.get('/:id/orders', verifyToken, asyncHandler(async(req, res) => {
    const { id } = req.params;
    if(req.user !== id) throw new AppError('Unauthorized', 401)
    const user = await User.findById(id).populate('orders')
    if(!user) throw new AppError('User does not exist', 400)
    const { orders: unsortedOrders } = user;
    const orders = unsortedOrders.sort((a, b) => b.createdAt - a.createdAt)
    res.status(200).json({ orders })
}))

module.exports = router;