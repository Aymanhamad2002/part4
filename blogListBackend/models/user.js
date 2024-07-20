const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  username:{
    type:String,
    minLength: 3,
    unique : true,
  },
  name:String ,
  hashPassword :String,
  blogs:[
    { type : mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON',{
  transform: (document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.hashPassword
    delete returnedObject.__v
  }
})

const User = mongoose.model('User',userSchema)
module.exports = User