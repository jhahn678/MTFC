const router = require('express').Router()
const Product = require('../models/product')
const Category = require('../models/category')
const asyncHandler = require('express-async-handler')
const AppError = require('../utils/AppError')
const Variant = require('../models/variant')
const { verifyAdmin } = require('../middleware/auth')

router.get('/', asyncHandler(async (req, res) => {
    const { page=1, limit=15, sort: sortMethod } = req.query;
    let sort;
    if(sortMethod === 'price'){
        sort = { 'price.min_price': 1 }
    }else if(sortMethod === '-price'){
        sort = { 'price.min_price': -1 }
    }else if(sortMethod){
        sort = sortMethod;
    }
    const count = await Product.countDocuments()
    const products = await Product.find().sort(sort).limit(limit).skip((page-1)*limit)
    res.status(200).json({ products, count })
}))

router.get('/featured', asyncHandler(async (req, res) => {
    const featuredProducts = await Product.find({ 'meta.featured': true })
        .populate('category')
        .select({ _id: 1, name: 1, slug: 1, description: 1, image: { $first: '$images'}, price: 1 })
    res.json(featuredProducts).status(200)
}))

router.get('/search', asyncHandler(async(req, res) => {
    const { value } = req.query
    const products = await Product.aggregate().search({
        index: 'products',
        text: {
            query: value,
            path: {
                'wildcard': '*'
            },
            fuzzy: {}
        }
    }).project({
        _id: 0, name: 1, slug: 1, description: 1, image: { $first: '$images'}
    }).limit(4)
    res.status(200).json(products)
}))

router.get('/:slug', asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate('category variants')
    if(!product){
        const productById = await Product.findById(slug).populate('category variants')
        if(!productById) res.status(400).json({ error: 'No product found' })
        return res.status(200).json(productById)
    }
    res.status(200).json(product)
}))

router.patch('/:id', verifyAdmin, async (req, res) => {
    //admin edit product
})

router.delete('/:id', verifyAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id)
    for(let v of product.variants){
        await Variant.findByIdAndDelete(v._id)
    }
    res.status(204).json({message: 'Product and variants deleted'})
}))

router.post('/', verifyAdmin, asyncHandler(async (req, res) => {
    const { name, category: categoryName, price, description, images, tags } = req.body
    const category = await Category.findOne({ slug: categoryName })
    if(!category) throw new AppError('Invalid category name: Must match category slug in database', 400)
    const newProduct = new Product({
        name,
        category: category._id,
        description,
        price: { min_price: price ? price : null , max_price: price ? price : null },
        tags,
        images
    })
    const product = await newProduct.save();
    res.status(200).json(product)
}))

router.get('/category/:slug', asyncHandler(async (req, res) => {
    const { page=1, limit=15, sort: sortMethod } = req.query;
    let sort;
    if(sortMethod === 'price'){
        sort = { 'price.min_price': 1 }
    }else if(sortMethod === '-price'){
        sort = { 'price.min_price': -1 }
    }else{
        sort = sortMethod;
    }
    const { slug } = req.params;
    const category = await Category.findOne({ slug })
    if(category.has_children){
        const categories = await Category.find({ 'ancestors._id': category._id })
        const categoryIdArray = categories.map(c => c._id)
        const count = await Product.countDocuments({ category: { $in: categoryIdArray }})
        const products = await Product.find({ category: { $in: categoryIdArray }}).sort(sort).limit(limit).skip(limit*(page-1))
        res.json({ products, count, category }).status(200)
    }else{
        const count = await Product.countDocuments({ category: category._id })
        const products = await Product.find({ category: category._id }).sort(sort).limit(limit).skip(limit*(page-1))
        res.json({ products, count, category }).status(200)
    }
}))

//Returns four similar products
router.get('/:slug/similar', asyncHandler(async(req, res) => {
    const { slug } = req.params;
    const { limit=4 } = req.query
    const productNameSlice = slug.split('-').slice(0, 1)
    const productsBySimilarName = await Product.aggregate()
        .search({ index: 'products',
            text: {
                query: productNameSlice,
                path: {
                    'wildcard': '*'
                }
            }
        })
        .project({ _id: 1, name: 1, slug: 1, description: 1, image: { $first: '$images'}, price: 1 })
        .limit(limit)
    let products = productsBySimilarName.filter(p => p.slug !== slug)
    if(products.length < limit){
        const product = await Product.findOne({ slug: slug })
        const productsByCategory = await Product
            .find({ category: product.category, slug: { $ne: slug }})
            .limit(limit-products.length)
            .select({ _id: 1, name: 1, slug: 1, description: 1, image: { $first: '$images'}, price: 1 })
        products = products.concat(productsByCategory)
        res.json(products).status(200)
    }else{
        res.json(products).status(200)
    }
}))

module.exports = router;