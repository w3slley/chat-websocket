const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)


function deleteUser(users, deleteUser){//function to delete user from usersOnline array
  for (let i=0;i<users.length;i++){
    if(users[i] == deleteUser){
        users.splice(i,1)
    }
  }
  return users
}

app.use(express.static('public'))

app.get('/', (req, res)=>{
  res.sendFile(__dirname+'/index.html')
})
let numUsers = 0//initially num of users online is 0 because no one is online
let usersOnline = []
io.on('connection', function(socket){
  //console.log('a user connected');
  /*socket.on('disconnect', function(){
    console.log('a user disconnected');
  })*/
  numUsers++ //it increases by one after a user logs in
  socket.on('set username', function(username){
    usersOnline.push(username)
    console.log(usersOnline)
    socket.username = username
    socket.broadcast.emit('joined', socket.username+' joined the room')
  })
  socket.on('get username', function(username){
    io.emit('get username', usersOnline)
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
    io.emit('left',{message: `${socket.username} left the room`, username: socket.username})
    deleteUser(usersOnline, socket.username)//deletes user from usersOnline array
    console.log(usersOnline)
    io.emit('delete username')
    numUsers--
    io.emit('number of users', numUsers)//passing num of users after one disconnects
  })
  socket.on('number of users', function(){
    io.emit('number of users', numUsers)//passing num of users to view
  })

})

http.listen(3000, function(){
  console.log('Server started at port 3000!')
})
