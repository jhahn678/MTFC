const mongoose = require('mongoose')
const createSlug = require('../utils/createSlug')

const categorySchema = new mongoose.Schema({
    name: String,
    slug: {
        type: String,
        index: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Category'
    },
    ancestors: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category'
            },
            name: String,
            slug: String
        }
    ],
    has_children: Boolean,
    meta: {}
})

categorySchema.pre('save', function(next){
    this.slug = createSlug(this.name);
    next()
})


module.exports = mongoose.model('Category', categorySchema)