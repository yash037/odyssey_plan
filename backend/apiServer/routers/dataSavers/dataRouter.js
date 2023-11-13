const express = require('express')
const dataRouter = express.Router()

const mongoose = require('mongoose');
const { createTestAccount } = require('nodemailer');
const documentSchema = require('../../database/schema/documentSchema').documentSchema
const Doc = mongoose.model('Documents' , documentSchema)

dataRouter.post('/saveContent' ,async (req,res) => {
    console.log(req.body.data)
    try{
        var doc = await Doc.findOne({Id : req.body.data.databaseId })
        if( doc == null ){
            await Doc.create( { 
                Id : req.body.data.databaseId ,
                data : req.body.data.content , 
                type : req.body.data.filetype
            } )
        }
        else{
            doc.data = req.body.data.content
            await doc.save()
        }
        res.status(200)
    }
    catch ( e ){
        res.status(400)
    }
   
})

dataRouter.get('/getContent' , async (req,res)=>{
    var doc = await Doc.findOne({Id : req.query.databaseId})
    if( doc == null ){
        res.status(201)   //201 flag here represent's use default data
    }
    else{
        res.status(200).send({ data : doc.data })
    }
    res.end()
})

module.exports = dataRouter