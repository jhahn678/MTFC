const express = require('express')
const router = express.Router()
const Variant = require('../models/variant')
const Product = require('../models/product')
const Category = require('../models/category')
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/AppError')
const { verifyAdmin } = require('../middleware/auth')

//Create a single variant
router.post('/', verifyAdmin, asyncHandler(async(req, res) => {
    const { product, variant_type, display_name, image, price, stock, meta } = req.body;
    const variant = new Variant({ product, variant_type, display_name, image, price, stock, meta })
    const newVariant = await variant.save()
    if(image){
        const parentProduct = await Product.findById(product)
        if(!parentProduct.images.includes(image)){
           const updatedProduct = await parentProduct.update({ $push: { images: image }})
           return res.json({ updatedProduct, newVariant}).status(200)
        }
    }
    res.json(newVariant).status(200)
}))


////@DEVELOPMENT ENDPOINT
//Generate variants for a single product or array of products
router.post('/generate-variants-for-product', verifyAdmin, asyncHandler(async(req, res) => {
    const { _id, variant_type, display_names, price } = req.body;
    if(Array.isArray(_id)){
        for(let id of _id){
            for(let name of display_names){
                const variant = new Variant({
                    product: id,
                    variant_type: variant_type,
                    display_name: name,
                    price: price,
                    stock: 100
                })
                await variant.save()
            }
        }
        const product = await Product.findById(_id[0]).populate('variants').select('variants variant_types')
        res.json(product).status(200)
    }else{
        for(let name of display_names){
            const variant = new Variant({
                product: _id,
                variant_type: variant_type,
                display_name: name,
                price: price,
                stock: 100
            })
            await variant.save()
        }
        const product = await Product.findById(_id).select('variants variant_types')
        res.json(product).status(200)
    }
}))

//Delete a variant
router.delete('/:id', verifyAdmin, asyncHandler(async(req, res) => {
    const { id } = req.params;
    const variant = await Variant.findByIdAndDelete(id)
    const product = await Product.findByIdAndUpdate(variant.product, { $pull: { variants: id }}, { new: true }).populate('variants')
    if(!product.variants.some(v => v.variant_type === variant.variant_type)){
        await Product.findByIdAndUpdate(variant.product, { $pull: { variant_types: variant.variant_type }}, {new: true})
    }
    if(
        product.price.max_price === variant.price || 
        product.price.min_price === variant.price &&
        !product.variant.some(v => v.price === variant.price)
    ){
        const max = product.variants.reduce((x, y) => x.price > y.price ? x.price : y.price)
        const min = product.variants.reduce((x, y) => x.price < y.price ? x.price: y.price)
        await Product.findByIdAndUpdate(variant.product, { $set: { 'price.min_price': min, 'price.max_price': max }})
    } 
    res.json({ message: 'Variant successfully deleted' }).status(200)
}))

//Return all product variants
router.get('/product/:id', asyncHandler(async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('variants').select('variants')
    if(!product) res.json({ error: 'Invalid product id '}).status(400)
    res.json(product).status(200)
}))

//Update variant stock
router.patch('/:id/stock', verifyAdmin, asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    await Variant.findByIdAndUpdate(id, { stock: stock })
    res.json({ message: `Variant stock updated to ${stock}`}).status(200)
}))

module.exports = router;