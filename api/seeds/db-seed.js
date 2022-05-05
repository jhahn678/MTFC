const Product = require('../models/product')


const productSeeds = [
    {
        name: '',
        description: '',
        category: '',
        tags: [],
        image: ''
    }
]

module.exports = async () => {
    await Product.deleteMany()
    for(let prod of oldProductSeeds){
        const product = new Product({
            ...prod
        })
        await product.save();
    }
}
