const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => {
  return blogs.reduce((s,blog) => s+blog.likes,0)
}
const favoriteBlog = (blogs) => {
  if(blogs.length ===0 ) return null
  if (blogs.length ===1) return blogs[0]
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  const result = blogs.filter(blog => blog.likes === maxLikes)
  return result[0]
}
const mostBlogs = (blogs) => {
  if(blogs.length === 0) return null
  let authors = blogs.map(blog => blog.author)
  authors  = [...new Set(authors )]

  const numberofblogs = []
  for(let i = 0 ; i< authors.length ; i++){
    let sum = 0
    blogs.forEach(note => {
      if(note.author === authors[i]){
        sum ++
      }
      numberofblogs[i] = sum

    })

  }
  let  maxindex = 0
  for(let i = 1 ; i< numberofblogs.length; i++) {
    if(numberofblogs[i]>numberofblogs[maxindex]){
      maxindex = i
    }
  }
  return { author: authors[maxindex],
    blogs: numberofblogs[maxindex]
  }
}
const mostLikes = (blogs) => {

  if(blogs.length === 0 ) {return null}
  const result = favoriteBlog(blogs)
  const author = result.author
  let sum = 0
  for(let i = 0 ; i < blogs.length ; i++) {
    if(blogs[i].author === author){
      sum += blogs[i].likes
    }
  }
  return({ author,likes:sum } )
}
module.exports = {
  mostLikes,
  mostBlogs,
  dummy,
  totalLikes,
  favoriteBlog
}