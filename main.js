const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)


app.use(express.static('public'))

app.get('/', (req, res)=>{
  res.sendFile(__dirname+'/index.html')
})

io.on('connection', function(socket){
  //console.log('a user connected');
  /*socket.on('disconnect', function(){
    console.log('a user disconnected');
  })*/

  socket.on('username', function(username){
    socket.username = username
    io.emit('joined', socket.username+' joined the room')
    console.log(socket.username)

  })
  socket.on('chat message', function(msg){
    let data = {message: msg, username: socket.username, time: new Date() }
    io.emit('chat message', data)
  })
  socket.on('typing-in', function(){
    socket.broadcast.emit('typing-in', socket.username)
  })
  socket.on('typing-out', function(){
      socket.broadcast.emit('typing-out')
  })

  socket.on('disconnect',function(){
    io.emit('left', `${socket.username} left the room`)
  })

})

http.listen(3000, function(){
  console.log('Server started at port 3000!')
})
