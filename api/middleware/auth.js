const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) return res.status(403).json({ error: err.message })
            req.user = decoded.id;
            next()
        })
    }else{
        res.status(401).json({error: 'Not authorized: Login required'})
    }
}

// const verifyAdmin = async (req, res, next) => {
//     if(req.headers.Authorization && req.headers.Authorization.startsWith('Bearer')){
//         const token = req.headers.Authorization.split(' ')[1];
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if(err) res.status(403).json({error: err.message})
//             const admin = await Admin.findById(decoded)
//             if(!admin) res.status(403).json({ error: 'Not authorized' })
//             next()
//         }) 
//     }
//     res.status(401).json({ error: 'Not authorized' })
// }
 
module.exports = { verifyToken }