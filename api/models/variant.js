const mongoose = require('mongoose')
const Product = require('./product')

const variantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    product_name: String,
    product_slug: String,
    variant_type: String,
    display_name: String,
    image: String,
    price: Number,
    stock: Number, 
    meta: {},
}, { timestamps: true })

// TO ADD LATER
// promotion: Object

variantSchema.pre('save', async function(next){
    if(!this.image){
        const product = await Product.findById(this.product)
        this.image = product.images[0]
        next()
    }
    if(!this.product_slug || !this.product_name){
        const product = await Product.findById(this.product)
        this.product_name = product.name;
        this.product_slug = product.slug;
        next()
    }
})

variantSchema.post('save', async function(){
    const product = await Product.findOneAndUpdate({ _id: this.product }, { $push: { variants: this._id }}, {new: true})
    // Readjust product max price if this variant exceeds it
    if(!product.max_price || this.price > product.max_price){
        const priceData = { ...product.price }
        priceData.max_price = this.price;
        product.price = { ...priceData }
        await product.save()
    }
    // Readjust product min price if this variant exceeds it
    if(!product.max_price || this.price < product.min_price){
        const priceData = { ...product.price }
        priceData.min_price = this.price;
        product.price = { ...priceData }
        await product.save()
    }
    // If this is a new variant_type for product, add to variant_types array
    if(!product.variant_types.includes(this.variant_type)){
        const variantTypes = [ ...product.variant_types, this.variant_type ]
        product.variant_types = variantTypes;
        await product.save()
    }
})

module.exports = mongoose.model('Variant', variantSchema)
