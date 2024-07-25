const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
require('express-async-errors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const mongoUrl = config.mongoUrl
logger.info('Connecting to the Database')

mongoose.connect(mongoUrl).then(() => {
  logger.info('connected to the Database')
}).catch(error => {logger.error(error)})

app.use(cors())
app.use(express.json())


app.use('/api/blogs',blogRouter)
app.use('/api/users',userRouter)
app.use('/api/login',loginRouter)
app.use(middleware.errorHandler)

module.exports = app