const express = require('express')

const {register, login, getDetails }  = require('../controllers/authController')
const {isAuthenticated} = require('../middlewares/authMiddleware')

const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.get('/me', isAuthenticated, getDetails)


module.exports = router