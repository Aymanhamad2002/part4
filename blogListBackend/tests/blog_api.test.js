const { test,describe,after,beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')

const api = supertest(app)

beforeEach(  async () => {
  await Blog.deleteMany({})
  const blogsObjects = helper.blogs.map(blog => new Blog(blog))
  const promiseArray = blogsObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  await User.deleteMany({})
  const usersObjects = helper.initialUsers.map(user => new User(user))
  const promiseArr = usersObjects.map(user => user.save())
  await Promise.all(promiseArr)

})
test('all data returned are of type json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type',/application\/json/)
})
test('all the data are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length,helper.blogs.length)
})
test('the data returned contains the key id instead of _id', async () => {
  const result = await helper.blogsInDb()
  const allHaveId = result.every(blog => 'id' in blog)
  assert(allHaveId,'Npt all th the data contain an id')
})
describe.only('adding a blog',() => {
  test('the data added is returned as json', async () => {
    const userIndb  = await helper.usersInDb()
    console.log(userIndb)
    const loginData  = await api.post('/api/login')
      .send({
        username: userIndb[0].username,
        password : userIndb[0].hashPassword,
      })
    const newItem = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }
    await api.post('/api/blogs')
      .send(newItem)
      .set({ Authorization: ` Bearer ${loginData.body.token}` })
      .expect(201)
      .expect('Content-Type',/application\/json/)
  })
})
  test('the data added is the same of returned',async () => {
    const newItem = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }
    const result = await  api
      .post ('/api/blogs')
      .send(newItem)
    assert.strictEqual(result.body.title, newItem.title)
    assert.strictEqual(result.body.author, newItem.author)
    assert.strictEqual(result.body.url, newItem.url)
    assert.strictEqual(result.body.likes, newItem.likes)
  })
  // test('the initial data length is increased by one', async () => {
  //   const initialData = await helper.blogsInDb()
  //   const newItem = {
  //     title: 'Type wars',
  //     author: 'Robert C. Martin',
  //     url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  //     likes: 2,
  //   }
  //   await api
  //     .post('/api/blogs')
  //     .send(newItem)
  //   const dataAtTheEnd =  await helper.blogsInDb()
  //   assert.strictEqual(initialData.length + 1 ,dataAtTheEnd.length)
  // })
})
test('there is a property likes even if its missing from the request', async () => {
  const newItem = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }
  const result  = await api
    .post('/api/blogs')
    .send(newItem)
  console.log()
  assert('likes' in result.body)

})
test('the likes are set to zero by default if they are missing', async () => {
  const newItem = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }
  const result  = await api
    .post('/api/blogs')
    .send(newItem)
  assert.strictEqual(result.body.likes,0)
})

test('if title is mssing retrun 400 as status code ', async () => {
  const newItem = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }
  const result = await api
    .post('/api/blogs')
    .send(newItem)
    .expect(400)


})
test('if url is mssing retrun 400 as status code ', async () => {
  const newItem = {
    title: 'Type wars',
    author: 'Robert C. Martin',

  }
  const result = await api
    .post('/api/blogs')
    .send(newItem)
    .expect(400)
})
describe ('Deleting a note', () => {
  test('note are successufly removed from the database',async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length -1 ,blogsAtEnd.length)

  })
  test('the database returned doesnt contain the data removed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
    const blogsAtEnd = await helper.blogsInDb()
    const titleList = blogsAtEnd.map(blog => blog.title)
    assert(!(titleList.includes(blogToDelete.title)))
  })
})
describe('updating a note', () => {
  test('the database contain the data updated',async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate  = blogsAtStart[0]
    const newBlog = { author:blogsAtStart[0].author,url:blogsAtStart[0].url,likes:blogsAtStart[0].likes, title:'for testing' }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
    const blogsAtEnd = await helper.blogsInDb()
    const titleList = blogsAtEnd.map(blog => blog.title)
    console.log(titleList)
    assert(titleList.includes('for testing'))
  })
})
after(async () => {
  await mongoose.connection.close()
})