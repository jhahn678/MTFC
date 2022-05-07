const asyncHandler = require('express-async-handler')
const createShippingRates = require('../utils/createShippingRates')
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const User = require('../models/user')
const Order = require('../models/order')
const Variant = require('../models/variant')
const Cart = require('../models/cart')
const express = require('express')
const router = express.Router()

router.post('/webhook', express.raw({type: 'application/json'}), asyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature']
    let event;
    try{
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    }catch(err){
        return res.status(400).send(`Stripe webhook error: ${err.message}`)
    }
    if(event.type === 'checkout.session.completed'){
        console.log('checkout session completed')
        const completedSession = event.data.object;
        const session = await stripe.checkout.sessions.retrieve(completedSession.id, { expand: ['shipping_rate'] })
        const lineItems = await stripe.checkout.sessions.listLineItems(completedSession.id, { expand: ['data.price.product'] })
        const order = new Order({
            customer: {
                user_id: session.metadata.user_id || null,
                name: session.customer_details.name,
                email: session.customer_details.email,
                phone: session.customer_details.phone,
                address: session.customer_details.address
            },
            total: {
                amount_subtotal: session.amount_subtotal,
                amount_discount: session.total_details.amount_discount,
                amount_shipping: session.total_details.amount_shipping,
                amount_tax: session.total_details.amount_tax,
                amount_total: session.amount_total
            },
            stripe: {
                checkout_session: session.id,
                payment_intent: session.payment_intent,
                payment_status: session.payment_status,
                shipping_rate: session.shipping_rate.id
            },
            products: lineItems.data.map(item => ({
                variant_id: item.price.product.metadata.variant_id,
                product_id: item.price.product.metadata.product_id,
                name: item.price.product.name,
                image: item.price.product.metadata.image,
                description: item.price.product.description,
                unit_price: item.price.unit_amount,
                total_price: item.amount_total,
                quantity: item.quantity
            })),
            shipping: {
                method: session.shipping_rate.display_name,
                delivery_estimate: `${session.shipping_rate.delivery_estimate.minimum.value}-${session.shipping_rate.delivery_estimate.maximum.value} business days`,
                name: session.shipping.name,
                address: session.shipping.address
            }
        })
        const newOrder = await order.save()
        for(let product of newOrder.products){
            const variant = await Variant.findById(product.variant_id)
            const updatedStock = variant.stock - product.quantity;
            await Variant.findByIdAndUpdate(product.variant_id, { $set: { stock: updatedStock }})
        }
        if(session.metadata.user_id) {
            await User.findByIdAndUpdate(session.metadata.user_id, {
                $push: { orders: newOrder._id }
            })
        }
        return res.status(200).json({ message: 'Order proccessed successfully'})
    }
}))


router.post('/create-stripe-session', asyncHandler(async (req, res) => {
    const { cartId } = req.body;
    const cart = await Cart.findById(cartId).populate({ path: 'items', populate: { path: 'variant' }})
    const user = await User.findOne({ cart: cartId })
    const shippingOptions = createShippingRates()
    const formattedCartItems = cart.items.map(item => ({
        quantity: item.quantity,
        price_data: {
            currency: 'usd',
            unit_amount: parseInt(item.variant.price * 100),
            product_data: {
                name: item.variant.product_name,
                images: [item.variant.image],
                description: `${item.variant.variant_type}: ${item.variant.display_name}`,
                metadata: {
                    product_id: item.variant.product,
                    variant_id: item.variant._id.valueOf(),
                    image: item.variant.image
                }
            }
        }
    }))
    const stripeSessionConfig = {
        success_url: `${process.env.BASE_URL}/checkout/success?redirect=true`,
        cancel_url: `${process.env.BASE_URL}/cart?order_cancelled`,
        line_items: formattedCartItems,
        payment_method_types: ['card'],
        shipping_address_collection: {
            allowed_countries: ['US']
        },
        shipping_options: shippingOptions,
        mode: 'payment',
        metadata: { 
            user_id: null 
        }
    }
    if(user){
        stripeSessionConfig.customer_email = user.account.email
        stripeSessionConfig.metadata.user_id = user._id.valueOf()
    }
    const stripeSession = await stripe.checkout.sessions.create(stripeSessionConfig)
    res.status(200).json({ sessionId: stripeSession.id })
}))

module.exports = router;











//Not in use

// router.post('/create-payment-intent/:cartId', asyncHandler(async(req, res) => {
//     const { cartId } = req.params;
//     const cart = await Cart.findById(cartId).populate('items.itemId')
//     const cartTotal = cart.items.reduce((a, b) => a + (b.quantity * b.itemId.unitPrice), 0)
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: cartTotal.toFixed(2) * 100,
//         currency: 'usd',
//         payment_method_types: ['card']
//     })
//     res.status(200).json({ client_secret: paymentIntent.client_secret })
// }))