const mongoose = require('mongoose')

module.exports = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`Connected to Mongo: ${process.env.MONGO_URI}`)
    }catch(err){
        if(err) console.log(err)
    }
}
