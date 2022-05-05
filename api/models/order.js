const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customer: {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
        phone: mongoose.Schema.Types.Mixed,
        address: {
            city: String,
            country: String,
            line1: String,
            line2: mongoose.Schema.Types.Mixed,
            postal_code: String,
            state: String
        }
    },
    total: {
        amount_subtotal: Number,
        amount_discount: Number,
        amount_shipping: Number,
        amount_tax: Number,
        amount_total: Number
    },
    stripe: {
        checkout_session: String,
        payment_intent: String,
        payment_status: String,
        shipping_rate: String
    },
    products: [
        {
            variant_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Variant'
            },
            name: String,
            description: String,
            image: String,
            unit_price: Number,
            total_price: Number,
            quantity: Number
        }
    ],
    shipping: {
        method: String,
        delivery_estimate: String,
        name: String,
        address: {
            city: String,
            country: String,
            line1: String,
            line2: mongoose.Schema.Types.Mixed,
            postal_code: String,
            state: String
        }
    },
    status: { 
        type: String,
        enum: ['Received', 'Being prepared', 'Available for pickup', 'Shipped', 'Fulfilled'],
        default: 'Received'
    },
    order_comment: String
}, { timestamps: true })


module.exports = mongoose.model('Order', orderSchema)