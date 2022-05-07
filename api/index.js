const express = require('express')
const app = express()
const AppError = require('./utils/AppError')

app.use((req, res, next) => {
    if(req.originalUrl === '/checkout/webhook'){
        next()
    }else{
        express.json()(req, res, next)
    }
})
const cors = require('cors')
app.use(cors())

const helmet = require('helmet')
app.use(helmet());

require('dotenv').config({path: './config/config.env'})

require('./config/mongodb')();
require('./seeds/seedProducts')();   ///////Seeding for development

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const checkoutRoutes = require('./routes/checkout')
const orderRoutes = require('./routes/orders')
const userRoutes  = require('./routes/user')
const categoryRoutes = require('./routes/categories')
const variantRoutes = require('./routes/variants')
const adminRoutes = require('./routes/admin')

app.use('/auth', authRoutes)
app.use('/cart', cartRoutes)
app.use('/products', productRoutes)
app.use('/variants', variantRoutes)
app.use('/checkout', checkoutRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)
app.use('/categories', categoryRoutes)
app.use('/admin', adminRoutes)

app.all('*', (req, res) => {
    throw new AppError('Requested resource does not exist', 404)
})

app.use((err, req, res, next) => {
    console.log(err)
    if(!err.status) err.status = 500
    res.status(err.status).json({error: err.message})
})

app.listen(process.env.PORT, () => {
    console.log(`running on port ${process.env.PORT}`)
})