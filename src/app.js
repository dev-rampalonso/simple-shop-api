const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const bluebird = require('bluebird')

const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')
const userRoutes = require('./routes/users')

mongoose.Promise = bluebird
mongoose.connect(`mongodb://dev:Mlm3t80mm@simple-shop-app-shard-00-00-u6ial.mongodb.net:27017,simple-shop-app-shard-00-01-u6ial.mongodb.net:27017,simple-shop-app-shard-00-02-u6ial.mongodb.net:27017/test?ssl=true&replicaSet=Simple-shop-app-shard-0&authSource=admin`)

/*mongoose.connect('mongodb://dev:'+process.env.MONGO_ATLAS_PWD+'@simple-shop-app-shard-00-00-u6ial.mongodb.net:27017,simple-shop-app-shard-00-01-u6ial.mongodb.net:27017,simple-shop-app-shard-00-02-u6ial.mongodb.net:27017/test?ssl=true&replicaSet=Simple-shop-app-shard-0&authSource=admin')*/

app.use(morgan('dev'))
app.use('/uploads',express.static('uploads'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin','*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept, Authorization')
  if(req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH')
    return res.status(200).json({})
  }
  next()
})

// request handlers
app.use('/products',productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)


app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      message: err.message
    }
  })
})

module.exports = app