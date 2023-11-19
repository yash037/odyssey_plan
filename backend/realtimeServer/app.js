require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express();
const Server = require('socket.io')
const server = http.createServer( app )
const mongoose = require('mongoose')

const Document = mongoose.model('document' , require('./database/documentSchema').documentSchema )
const User = mongoose.model('user' , require('./database/userSchema').userSchema )
const Workspace = mongoose.model('workspaces' , require('./database/workspaceSchema.js').workspaceSchema)

const io = Server(server , {
    cors : {
        origin : 'http://localhost:3000',
        method : ["GET" , "POST"]
    }
})
server.listen(process.env.REAL_TIME_PORT , ()=>{
    console.log('real time server is on at ' + process.env.REAL_TIME_PORT)
})
io.on('connection' , (socket) => {
   
    socket.on( 'send-changes' , ( delta , documentId) => {
        socket.broadcast.to( documentId ).emit( 'recieve-change' , delta );
    })

    socket.on( 'join-document-room' , async ( documentId  , memberId ) => {
        
        var data = await Document.findOne( { Id : documentId } )
        const user = await User.findOne( { Id : memberId.substr( 1 , memberId.length - 1 ) } );

        if( data == null ){
            data = await Document.create( { Id : documentId , data : '' } );
        }
        console.log('requested to join room',documentId)
        data.activeMembers = data.activeMembers.filter((data) => {
            return data != user.Id
        })
        data.activeMembers.push( { Id : user.Id, name : user.username } );
        await data.save();
        socket.join(documentId);
        socket.emit('load-document' , data.data , data.activeMembers)
        socket.broadcast.to(documentId).emit( 'new-member-joined' , memberId.substr( 1 , memberId.length - 1 ) , user.username )
        
    })

    socket.on('save-document' , async (documentId , documentData)  => {
        const doc = await Document.findOne({ Id : documentId })
        doc.data = documentData
        await doc.save()
    })

    socket.on( 'member-left' ,  async ( documentId , memberId ) => {
        var doc = await Document.findOne({ Id : documentId })
        doc.activeMembers = doc.activeMembers.filter((data) => {
            return data.Id != documentId
        })
        await doc.save()
        socket.broadcast.to(documentId).emit( 'member-left' , memberId.substr( 1 , memberId.length - 1 ));
    })

    socket.on( 'cursor-movement' , ( documentId , memberId , selection) => {
         console.log(memberId.substr( 1 , memberId.length - 1 ) + ' moved')
        socket.to(documentId).emit( 'cursor-movement' , memberId.substr( 1 , memberId.length - 1 ) , selection );
    })

    socket.on( 'join-room' , async ( workSpaceId ) => { //every time the file explorer is loaded in frontend this will be emmitted
        var workspace = await Workspace.findOne({Id : workSpaceId})
        if( workspace == null ){
             await Workspace.create({Id : workSpaceId}) 
        }
        workspace = await Workspace.findOne({Id : workSpaceId})
        socket.join(workSpaceId)
        socket.to(workSpaceId).emit('load-file-explorer' , workspace)
    })

    socket.on( 'update-workspace' , async (workSpaceId , workSpaceData) => { //update the workspace and tell everyone to update it too
        var workspace = await Workspace.findOne({Id : workSpaceId})
        workspace.folderStructure = workSpaceData
        await workspace.save()
        socket.to(workSpaceId).emit('load-file-explorer' , workspace) 
    })
}) 

mongoose.connect("mongodb://127.0.0.1:27017/Odeysey").then(() => {
    console.log('mongodb is online');
})