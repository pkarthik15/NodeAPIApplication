const express = require('express')
const dotenv = require('dotenv').config();

const connectDB = require('./config/db')
const {errorHandler} = require('./middlewares/errorMIddleware')


connectDB()
const app = express()
const port = process.env.PORT || 5000;


app.use(express.json()); //Used to parse JSON bodies


app.use('/api/auth', require('./routes/authRoute'))




app.use(errorHandler);

app.listen(port, () => console.log('app is running'))
