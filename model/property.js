const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({

    pName:{
        type:String,
        required:true
    },
    pType:{
        type:String,
        required:true
    },
    room:{
        type:String,
        required:true
    },
    pAddress:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    year:{
        type:String,
        required:true
    },
    username:{
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

 module.exports = mongoose.model('Property', propertySchema)
