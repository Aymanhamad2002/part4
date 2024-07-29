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
const tokenExtractor = (request) => {

  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
const userExtractor = async (request, response, next) => {
  const token = tokenExtractor(request)
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }

  try {
    const decodedToken = jwt.verify(token, config.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    request.user = decodedToken.id
    next()
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' })
  }
}
module.exports = { errorHandler ,
  userExtractor,
  tokenExtractor,
}