const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

module.exports = mongoose.model('User',userSchema)