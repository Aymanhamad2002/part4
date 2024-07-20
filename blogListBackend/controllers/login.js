const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const loginRouter = require('express').Router()

loginRouter.all('/',async (request,response) => {
  const body = request.body
  const username = body.username
  const password  = body.password
  const user = await User.findOne({ username })
  const correctPass = user === null ? false : bcrypt.compare(password,user.hashPassword)
  if(!(user && correctPass)){
    return response.status(401).json({ error : 'invalid username or password ' })
  }
  const userForToken = {
    username : user.username,
    id : user._id
  }
  const token = jwt.sign(userForToken,config.SECRET)
  response.status(200).json({ token,username: user.username,name : user.name })
})
module.exports = loginRouter