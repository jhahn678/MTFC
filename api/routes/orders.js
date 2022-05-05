const Order = require('../models/order')
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/AppError')
const express = require('express')
const router = express.Router()

router.get('/:id', asyncHandler(async(req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id)
    if(!order) throw new AppError('Order not found', 400)
    res.status(200).json({ order })
}))

module.exports = router;