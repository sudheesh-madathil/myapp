const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    name:{
        type:"String",
        required:"true"
    },
    place:{
        type:"String",
        required:"true"

    },
    phonenumber:{
        type:"number",
        required:"true"
    }
})
module.exports = mongoose.model('userdata',Schema)