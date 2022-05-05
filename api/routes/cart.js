const express = require('express');
const Cart = require('../models/cart');
const User = require('../models/user')
const Product = require('../models/product');
const Variant = require('../models/variant')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/AppError.js');


//Initializes cart with item provided
router.post('/', asyncHandler(async(req, res) => {
    const { userId, itemId, quantity } = req.body;
    const cart = new Cart({
        user: userId || null,
        items: [ 
            {
                variant: itemId,
                quantity: quantity
            }
        ],
    })
    const newCart = await cart.save()
    await User.findByIdAndUpdate(userId, { cart: newCart._id })
    res.json(newCart).status(200)
}))


//Fetches and returns populated cart 
router.get('/:id', asyncHandler(async(req, res) => {
    const { id } = req.params;
    const fetchedCart = await Cart.findById(id)
    if(!fetchedCart){
        throw new AppError('Cart does not exist', 404)
    }
    //map out all item ids and validate that theyre still valid.
    //In the case that items were removed from inventory. 
    let modified = false;
    fetchedCart.items.forEach( async (item) => {
        const productVariant = await Variant.findById(item.variant)
        if(!productVariant || (productVariant.stock < parseInt(item.quantity))){
            modified = true;
            const updated = await Cart.findByIdAndUpdate(id, { $pull: { items: { variant: item._id }}})
            if(updated.items.length < 1){
                await updated.remove()
                throw new AppError('Items previously in your cart are no longer available', 409)
            }
        }
    })
    //Respond with cart and let client know if items were removed
    const cart = await Cart.findById(id).populate({ path: 'items', populate: { path: 'variant' }})
    res.json({modified, cart}).status(200)
}))


//Deletes cart
router.delete('/:id', asyncHandler(async(req, res) => {
    const { id } = req.params;
    const cart = await Cart.findByIdAndDelete(id)
    if(cart.user){
        await User.findOneAndUpdate({ $and: [{ _id: cart.user }, { cart: id }] }, { $set: { cart: null }})
    }
    res.status(200).json('Cart successfully deleted')
}))

//Updates the quantity of an item in cart
router.patch('/:id', asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { itemId, quantity } = req.body;
    //if specified quantity is 0
    if(quantity < 1){
        const updatedCart = await Cart.findByIdAndUpdate(id, { $pull: 
            { items: { variant: itemId }}
        })
        if(updatedCart.items.length < 1){
            await updatedCart.remove()
            res.status(200).json({ message: 'Cart deleted' })
        }
    }
    const variant = await Variant.findById(itemId)
    //If item stock is less than specified quantity
    if(quantity > variant.stock){
        return res.status(400).json({ error: 'Requested quantity is greater than the quanitity in stock'})
    }
    //If item already exists in cart
    const cart = await Cart.findOneAndUpdate({ $and: [
            { _id: id },
            { 'items.variant': itemId }
        ]},
            { $set: { 'items.$.quantity': quantity }
    })
    //Fallback if item does not exist in cart
    if(!cart){
        await Cart.findByIdAndUpdate(id, { $push: { items: { variant: itemId, quantity: quantity }}})
    }
    res.status(200).json({ message: `Item quantity updated to: ${quantity}`})
}))

//Link cart and user
router.patch('/:id/set-user', asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    await Cart.findByIdAndUpdate(id, { $set: { 'user': userId }})
    await User.findByIdAndUpdate(userId, { $set: { 'cart': id }})
    res.status(200).json({ message: 'User link to cart successful' })
}))

//Adds item to cart -- Checks if item already exists in cart
//and updates quantity accordingly
router.patch('/:id/add-to-cart', asyncHandler(async(req, res) => {
    const { itemId, quantity } = req.body;
    const { id } = req.params;
    const variant = await Variant.findById(itemId)
    if(quantity > variant.stock){
        return res.status(400).json({ error: 'Requested quantity is greater than the quanitity in stock'})
    }
    const itemExistsInCart = await Cart.findOne({ $and: [
        { _id: id },
        { 'items.variant' : itemId }
    ]})
    //If the there is an exact match already in the cart, find quantity and update
    if(itemExistsInCart){
        const thisItem = itemExistsInCart.items.find(item => item.variant == itemId)
        const newQuantity = thisItem.quantity + quantity;
        if(newQuantity > variant.stock){
            return res.status(400).json({ error: 'Requested quantity is greater than the quanitity in stock' })
        }
        await Cart.findOneAndUpdate({ $and: [{ _id: id }, { 'items.variant': itemId }]}, 
            { $set: { 'items.$.quantity': newQuantity }},
        )
        res.json({ message: `Item quantity updated to ${newQuantity}`}).status(200)
    }else{
        console.log('didnt find that item in cart')
        await Cart.findByIdAndUpdate(id, {
            $push: { items: { variant: itemId, quantity: quantity } }
        })
        res.json({ message: `Item added to cart: ${itemId}` }).status(200)
    }
}))


//Removes item from cart
router.patch('/:id/remove-from-cart', asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { itemId } = req.body;
    await Cart.findByIdAndUpdate(id, {
        $pull: { items: { variant: itemId }}
    })
    res.json({ message: `Item removed from cart: ${itemId}`}).status(200)
}))


//Merges multiple items from a previous cart onto another cart
//Data for items is handled on the client
router.patch('/:id/merge-carts', asyncHandler(async (req, res) => {
    const { id  } = req.params;
    const { items } = req.body;
    for(let item of items){
        await Cart.findByIdAndUpdate(id, {
            $push: { items: { variant: item.variant, quantity: item.quantity } }
        })
    }
    const cart = await Cart.findById(id)
    res.json(cart).status(200)
}))


module.exports = router;