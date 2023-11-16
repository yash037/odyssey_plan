const express = require('express')
const dataRouter = express.Router()

const mongoose = require('mongoose');
const { workspaceSchema } = require('../../database/schema/workspaceSchema');

const documentSchema = require('../../database/schema/documentSchema').documentSchema
const Doc = mongoose.model('Documents' , documentSchema)

const FolderSchema = require('../../database/schema/workspaceSchema').workspaceSchema 
const Folder = mongoose.model( 'Workspace' , workspaceSchema )

dataRouter.post('/saveContent' ,async (req,res) => {
    
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
    res.end()
})

dataRouter.get('/getContent' , async (req,res)=>{

    var doc = await Doc.findOne({Id : req.query.databaseId})
   
    console.log(req.user)
    if( doc == null ){
        res.status(201)   //201 flag here represent's use default data
    }
    else{
        res.status(200).send({ data : doc.data , type : doc.type })
    }
    res.end()
})

dataRouter.get('/getFolder' , async (req , res) => {
    const data = await Folder.findOne( {Id : req.query.workspaceId} )
    if( data == null){
        res.status(201)
    }
    else{
        res.status(200).send({ data : data })
    }
    res.end()
})

dataRouter.post('/saveFolder' , async ( req , res ) => {
    var doc = await Folder.findOne({Id : req.query.databaseId})

    if( doc == null ){
        res.status(201)   //201 flag here represent's use default data
    }
    else{
        res.status(200).send({ data : doc.data , type : doc.type })
    }
    res.end()
})

module.exports = dataRouter