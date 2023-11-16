const express = require('express')
const dataRouter = express.Router()

const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const documentSchema = require('../../database/schema/documentSchema').documentSchema
const workspaceSchema = require('../../database/schema/workspaceSchema').workspaceSchema 
const Workspace = mongoose.model('Workspace' , workspaceSchema)
const Doc = mongoose.model('Documents' , documentSchema)

dataRouter.use( bodyParser.json({limit : '50mb'}) )
dataRouter.use( bodyParser.urlencoded({extended : true}) )

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
    if( doc == null ){
        res.status(201)   //201 flag here represent's use default data
    }
    else{
        res.status(200).send({ data : doc.data , type : doc.type })
    }
    res.end()
})

dataRouter.get('/getFolder' , async (req , res) => {
    let Id = req.query.workspaceId;
    if( Id == 'personal' ){
        Id = req.user.id
    }
   
    const data = await Workspace.findOne( {Id : Id} )
    if( data == null){
        res.status(201)
    }
    else{
        res.status(200).send({ data : data })
    }
    res.end()
})
var count = 0;
dataRouter.post('/saveFolder' , async ( req , res ) => {

        console.log('detected')
        let Id = req.body.data.workspaceId
        if ( Id == 'personal' ){
            Id = req.user.id
        }
        var fol = await Workspace.findOne({Id : Id })
        if( fol == null ){
            await Workspace.create( { 
                Id :Id ,
                folderStructure : req.body.data.content ,
            } )
        }
        else{
            fol.folderStructure = req.body.data.content
            await fol.save()
        }
        res.status(200)
    
        res.end()
})

module.exports = dataRouter