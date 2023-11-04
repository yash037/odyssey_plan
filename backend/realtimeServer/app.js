require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express();
const Server = require('socket.io')
const server = http.createServer( app )
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
    console.log('user connected')
    socket.on( 'send-changes' , ( delta , documentId) => {
        socket.broadcast.to( documentId ).emit( 'recieve-change' , delta );
    })

    socket.on( 'join-document-room' , ( documentId ) => {
        const data = " " //here we will have persitant data 
        console.log('requested to join room',documentId)
        socket.join(documentId);
        socket.emit('load-document' , data)
    })
})