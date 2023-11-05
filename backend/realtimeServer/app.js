require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express();
const Server = require('socket.io')
const server = http.createServer( app )
const mongoose = require('mongoose')

const Document = mongoose.model('document' , require('./database/documentSchema').documentSchema )

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

    socket.on( 'join-document-room' , async ( documentId ) => {
        var data = await Document.findOne({Id : documentId})
        if( data == null ){
            data = await Document.create({Id : documentId , data : ''});
        }
        console.log('requested to join room',documentId)
        socket.join(documentId);
        socket.emit('load-document' , data.data)
    })

    socket.on('save-document' , async (documentId , documentData)  => {
        const doc = await Document.findOne({ Id : documentId })
        doc.data = documentData
        await doc.save()
    })
})

mongoose.connect("mongodb://127.0.0.1:27017/Odeysey").then(() => {
    console.log('mongodb is online');
})