const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    projectLanguage:{
        type:String,
        required:true,
        enum:["python","java","cpp","javascript","c","go","bash"]
    },
    code:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId, // Corrected this line
        ref: 'User', // Ensure this matches the model name of the User schema
        required: true,
    },
    version:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('project',projectSchema)