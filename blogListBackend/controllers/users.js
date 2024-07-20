const User = require('../models/user')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()

userRouter.get('/',async (request,response) => {
  const result  = await User.find({}).populate('blogs')
  response.json(result)
})

userRouter.post('/', async (request,response) => {
  const body = request.body
  const username = body.username
  const name  = body.name
  const password = body.password
  if(password.length <4){
    return response.status(400).json({ error:'password should be at least 3 char' })
  }

  const hashPassword = await  bcrypt.hash(password,10)
  const newUser = { username,name,hashPassword }
  const userObject = new User(newUser)
  const result  = await userObject.save()
  return response.status(201).json(result)
})
module.exports = userRouter