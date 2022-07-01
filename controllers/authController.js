const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')




const register = asyncHandler( async (req, res) => {

    //Check for the request body
    const {name, email, password} = req.body
    if(!name || !email || !password)
    {
        res.status(400)
        throw new Error('Please add all fields')
    }

    //Check user with email already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    if (user) {
        res.status(201).json({
          id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id, user.name, user.email),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})


const login = asyncHandler( async (req, res) => {

   //Check for the request body
   const {email, password} = req.body
   if(!email || !password)
   {
       res.status(400)
       throw new Error('Please add credentials')
   }

   //Check user with email already exists
   const user = await User.findOne({ email })

   if (!user) {
       res.status(400)
       throw new Error(`Invalid email`)
   }

   if(!await bcrypt.compare(password, user.password))
   {
        res.status(400)
        throw new Error(`Invalid password`)
   }

   res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id, user.name, user.email),
    })

})


const getDetails = asyncHandler( async (req, res) => {
    res.status(200).json(req.user)
})



// Generate JWT
const generateToken = (id, name, email) => {
    return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
}




module.exports = {
    register,
    login,
    getDetails,
}