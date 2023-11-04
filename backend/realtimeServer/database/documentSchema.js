const mongoose=require('mongoose');


const documentSchema = new mongoose.Schema({
    
    Id : String,
    data : Object,
})

module.exports = { documentSchema }