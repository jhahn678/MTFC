const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    account: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        password: String,
        googleId: String,
        picture: String
    },
    shippingAddress: {
        name: {
            type: String,
            default: null
        },
        line1: {
            type: String,
            default: null
        },
        line2: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        state: {
            type: String,
            default: null
        },
        postal_code: {
            type: Number,
            default: null
        },
        country: {
            type: String,
            default: 'US'
        }
    },
    billingAddress: {
        name: {
            type: String,
            default: null
        },
        line1: {
            type: String,
            default: null
        },
        line2: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        state: {
            type: String,
            default: null
        },
        postal_code: {
            type: Number,
            default: null
        },
        country: {
            type: String,
            default: 'US'
        }
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ]
}, {timestamps: true})

userSchema.statics.findByEmail = async function(email){
    return await this.findOne({'account.email': email})
}

module.exports = mongoose.model('User', userSchema)