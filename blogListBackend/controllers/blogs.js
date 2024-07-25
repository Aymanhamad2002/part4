const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const result =  await Blog.find({}).populate('user')
  response.json(result)

})
blogRouter.post('/',middleware.userExtractor,  async (request, response) => {
  let  content  = request.body
  
  const userFromDb = await User.findById(request.user)
  
  if(!('likes' in content )){
    content  = { ...content ,likes:0 }
  }
  //if(!request.user){
  //return response.status(401).json({ error : 'token invalid' })
  //}
  const blog = {
    title: content.title,
    likes: content.likes,
    url: content.url,
    author: content.author,
    user: userFromDb._id,
  }

  const blogObject = new Blog(blog)
  const result = await blogObject.save()
  userFromDb.blogs = userFromDb.blogs.concat(result._id)
  await userFromDb.save()
  response.status(201).json(result)
})
blogRouter.delete('/:id',middleware.userExtractor, async(request,response) => {
  const userId = request.user
  if(!userId){
    return response.status(401).json({ error : 'invalid token  ' })
  }
  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).json({ error: 'blog not found' })
  }
  if(blog.user.toString() !== userId ){
    return response.status(401).json({ error: 'only user who create a blog can delete it' })
  }
  else{
    const removedData =  await Blog.findByIdAndDelete(request.params.id)
    const user =await  User.findById(userId)
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== blog._id.toString())
    await user.save()
    response.json(removedData)
  }
})
blogRouter.put('/:id',async(request,response) => {
  const body = request.body
  const blog = {
    title : body.title,
    url : body.url,
    likes: body.likes,
    author: body.author ,
  }
  const  result = await Blog.findByIdAndUpdate(request.params.id,blog,{ new:true }).populate('user')

  response.json(result)
})


module.exports = blogRouter