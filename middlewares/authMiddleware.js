const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const isAuthenticated = asyncHandler( async (req, res, next) => {

    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('bearer'))
    {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            const user = await User.findById(decoded.id).select('-password')

            req.user = {
                id : user._id,
                name : user.name,
                email : user.email,
                createdAt : user.createdAt,
                updatedAt : user.updatedAt
            }

            next()

        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    } 

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }

})

module.exports = { isAuthenticated }
