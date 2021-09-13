const path = require('path')

const http = require('http')


const express = require('express')
const socketio = require('socket.io')

const app  =  express()

const server = http.createServer(app)
const io = socketio(server)

const port = process.env.port  || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0
io.on('connection', (socket) =>{
    console.log('New web socket connection')

    socket.emit('countUpdated', count)

    socket.broadcast.emit('message', 'A new user has entered the chat')

    socket.on('increment', () =>{
        count++
        //socket.emit('countUpdated', count)

        io.emit('countUpdated', count)
    })
    
    socket.on('sendMessage', (msg)=>{
        io.emit('message', msg)
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the chat')
    })
})

server.listen(port, ()=> {
    console.log(`listening on port ${port}`)
})

