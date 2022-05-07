const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/AppError')
const createSlug = require('../utils/createSlug')
const { verifyAdmin } = require('../middleware/auth')

router.get('/', asyncHandler(async(req, res) => {
    const categories = await Category.find()
    return res.status(200).json(categories)
}))

router.get('/featured', asyncHandler( async(req, res) => {
    const categories = await Category.find({ 'meta.featured': true }).select('name slug meta')
    res.json(categories).status(200)
}))

router.get('/:slug', asyncHandler(async(req, res) => {
    const category = await Category.findOne({ slug: slug })
    if(!category) {
        const categoryById = await Category.findOne({ _id: slug })
        if(!categoryById) return res.json({ error: 'No category found' }).status(404)
        return res.json(categoryById).status(200)
    }
    res.json(category).status(200)
}))


router.post('/', verifyAdmin, asyncHandler(async(req, res) => {
    const { name, parent } = req.body;
    let parentCategory = null;
    let ancestors = [];
    if(parent){
        parentCategory = await Category.findOne({ slug: parent })
        if(!parentCategory) throw new AppError('Invalid parent category. Ensure parent is valid in slug format.', 400)
        const ancestorsFromParentCategory = parentCategory.ancestors;
        ancestors = [...ancestorsFromParentCategory, {
            _id: parentCategory._id,
            name: parentCategory.name,
            slug: parentCategory.slug
        }]
        await Category.findByIdAndUpdate(parentCategory._id, { $set: { has_children: true }})
    }
    const newCategory = new Category({
        name: name,
        parent: parent ? parentCategory._id : null,
        ancestors: ancestors
    })
    const category = await newCategory.save()
    res.status(200).json(category)
}))

router.patch('/:id', verifyAdmin, asyncHandler(async(req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    await Category.findByIdAndUpdate(id, { name: name }, { new: true })
    await Category.updateMany({ 'ancestors._id': id}, { $set: { 'ancestors.$.name': name, 'ancestors.$.slug': createSlug(name) }})
    res.status(200).json({ message: 'Category successfully updated' })
}))

module.exports = router;