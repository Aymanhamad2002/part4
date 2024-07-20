const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const result =  await Blog.find({}).populate('user')
  response.json(result)

})
blogRouter.post('/',  async (request, response) => {
  let  content  = request.body
  if(!('likes' in content )){
    content  = { ...content ,likes:0 }
  }
  const decodedToken = jwt.verify(request.token,config.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({ error : 'token invalid' })
  }
  const blog = {
    title: content.title,
    likes: content.likes,
    url: content.url,
    author: content.author,
    user: decodedToken.id,
  }

  const blogObject = new Blog(blog)
  const result = await blogObject.save()
  response.status(201).json(result)
})
blogRouter.delete('/:id', async(request,response) => {
  const userId = request.user
  if(!userId){
    return response.status(401).json({ error : 'invalid token '})
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
  const result = await Blog.findByIdAndUpdate(request.params.id,blog,{ new:true })
  response.json(result)
})


module.exports = blogRouter