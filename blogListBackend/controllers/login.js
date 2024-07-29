const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const loginRouter = require('express').Router()

loginRouter.post('/',async (request,response) => {
  const body = request.body
  const username = body.username
  const password  = body.password
  const user = await User.findOne({ username })
  if(!user){
    return response.status(401).json({ error : 'invalid username or password ' })
  }


  const correctPass = await  bcrypt.compare(password,user.hashPassword)

  if(!(correctPass)){
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