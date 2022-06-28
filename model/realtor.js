const mongoose = require('mongoose');

const realtorSchema = new mongoose.Schema({

    fName:{
        type:String,
        required:true
    },
    lName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    cEmail:{
        type:String,
        required:true
    },
    cNumber:{
        type:String,
        required:true
    },
    yearsOfExp:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    upload:{
        data:Buffer,
        contentType: String
    },

    date:{
        type:Date,
        default:Date.now

    }


});


 module.exports = mongoose.model('Realtor', realtorSchema)
