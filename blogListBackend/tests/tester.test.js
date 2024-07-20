const { test,describe,after,beforeEach } = require('node:test')
const assert = require('node:assert')
const helper = require('../utils/list_helper')
const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []
  const result = helper.dummy(blogs)
  assert.strictEqual(result,1)
})
describe ('total likes' , () => {
  test('of empty list is zero' , () => {
    const sum = helper.totalLikes([])
    assert.strictEqual(sum,0)
  })
  test('when list has only one blog equals the likes of that',() => {
    const item =[{ likes:5 }]
    const sum = helper.totalLikes(item)
    assert.strictEqual(sum,5)

  })
  test('of a biggere list is calculated right ', () => {
    const sum = helper.totalLikes(blogs)
    assert.strictEqual(sum,36)
  })
})
describe('MostLiked' ,() => {
  test('null returned with zero blogs', () => {
    const result =helper.favoriteBlog([])
    assert.strictEqual(result,null)
  })
  test('with one object the object is returned', () => {
    const result = helper.favoriteBlog([blogs[0]])
    assert.deepStrictEqual(result,blogs[0])
  })
  test('the most liked is returned', () => {
    const mostLiked = blogs[2]
    const result = helper.favoriteBlog(blogs)
    assert.deepStrictEqual(mostLiked,result)
  })
})

describe('mostBlogs',() => {
  test('return null for empty array', () => {
    const result = helper.mostBlogs([])
    assert.strictEqual(result,null)
  })
  test('for a big array the author is returned right', () => {
    const actualResult = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    const returnedResult = helper.mostBlogs(blogs)
    assert.deepStrictEqual(actualResult,returnedResult)
  })
})
describe('mostLikes', () => {
  test('for an empty array its return null',() =>{
    const result = helper.mostLikes([])
    assert.strictEqual(result,null)
  })
  test('for a big array it wil return the correct object', () => {
    const actualresult = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    const result = helper.mostLikes(blogs)
    assert.deepStrictEqual(result,actualresult)

  })
})