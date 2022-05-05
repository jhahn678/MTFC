const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [
        {
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Variant'
            },
            quantity: Number
        }
    ]
})

module.exports = mongoose.model('Cart', cartSchema)