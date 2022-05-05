const mongoose = require('mongoose')
const Category = require('../models/category')
const createSlug = require('../utils/createSlug')

const productSchema = new mongoose.Schema({
    name: String,
    slug: {
        type: String,
        index: true
    },
    description: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    tags: [String],
    variant_types: [String],
    variants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Variant'
        }
    ],
    images: [{
        type: String,
        default: 'https://storage.googleapis.com/mtfc-products/MTFC-svg/default-image.svg'
    }],
    shipping: {
        rate: {
            type: String,
            default: 'USPS Priority'
        },
        weight: {
            type: Number,
            default: .01
        }
    },
    price: {
        min_price: {
            type: Number,
            default: null
        },
        max_price: {
            type: Number,
            default: null
        }
    },
    meta: Object
}, { timestamps: true })

productSchema.pre('save', function(next){
    this.slug = createSlug(this.name);
    next()
})

productSchema.post('save', async function(){
    const nameTags = this.name.split(' ');
    const category = await Category.findById(this.category)
    const categoryTags = category.ancestors.map(a => a.name)
    const allTags = [...nameTags, ...categoryTags];
    const uniqueTags = allTags.filter(t => !this.tags.includes(t))
    this.tags = this.tags.concat(uniqueTags)
})

module.exports = mongoose.model('Product', productSchema)