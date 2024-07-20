const {test,after,beforeEach,describe } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./helper')
const User = require('../models/user')
const mongoose = require('mongoose')

const api = supertest(app)

beforeEach(  async () => {
  await User.deleteMany({})
  const blogsObjects = helper.initialUsers.map(blog => new User(blog))
  const promiseArray = blogsObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

})
test('username that is  too short will return 400',async () => {
  const newUser = { username:'ll',password:'22222ggg',name:'rony' }
  const response = await api
    .post('/api/blogs')
    .send(newUser)
    .expect(400)
  assert.strictEqual(response.body.error,'username is too short')
})
test('username that is not unique will return 400',async () => {
  const user =  { username: 'john_doe',name :'john',password:'333333333' }
  const response = await api
    .post('/api/blogs')
    .send(user)
    .expect(400)
  assert.strictEqual(response.body.error, 'expected username to be unique')
})


after(async () => {
  mongoose.connection.close()
})