require('dotenv').config()

const PORT = process.env.PORT
const SECRET = process.env.SECRET
const mongoUrl = process.env.NODE_ENV === 'test'? process.env.mongoUrl_Test : process.env.mongoUrl

module.exports = { PORT,mongoUrl ,SECRET }