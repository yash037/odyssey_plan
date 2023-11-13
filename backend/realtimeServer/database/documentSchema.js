const mongoose=require('mongoose');


const documentSchema = new mongoose.Schema({
    Id : String,
    data : Object,
    activeMembers : [ { Id : String , name : String}],
})

module.exports = { documentSchema }