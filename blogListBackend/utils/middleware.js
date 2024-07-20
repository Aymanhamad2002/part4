const logger = require('./logger')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const errorHandler =(error,request,response,next) => {
  logger.error(error.message)
  if(error.name ==='ValidationError'){
    return response.status(400).json( { error: 'username is too short' })
  }else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return response.status(400).json({ error: 'expected username to be unique' })
  }
  next(error)


}
const tokenExtractor = (request, response, next) => {
  let token = request.get('authorization')
  if (token && token.startsWith('Bearer ')) {
    token = token.replace('Bearer ', '')
  } else {
    token = null
  }
  request.token = token
  next()}
const userExtractor = (request, response,next) => {
  const token = request.token
  let  user = null
  if (!token ){
    user = null
  }else {
    const decodedToken =jwt.verify(token,config.SECRET)
    user = decodedToken.id
  }
  request.user = user
  next()
}
module.exports = { errorHandler ,
  userExtractor,
  tokenExtractor,
  
}