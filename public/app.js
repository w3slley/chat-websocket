const container = document.querySelector('.container')
const socket = io()

$('.setUsername').submit((e)=>{//sending username to server (will be stored in a session)
  e.preventDefault
  socket.emit('username', $('.username').val())
  $('.main').css('display','none')
  $('.container').css('display','block')
  $('.message').css('display', 'block')
  $('.message').focus()
  return false

})
$('.form').submit(function(e){//sending message to server
  e.preventDefault
  socket.emit('chat message', $('.message').val())
  $('.message').val('')
  return false
})

$('.message').keydown(function(){
  socket.emit('typing-in')
})
$('.message').keyup(function(){
  socket.emit('typing-out')
})


socket.on('chat message', function(msg){
  container.scrollTop = container.scrollHeight-container.clientHeight//make div scroll to bottom
  $('.messages').append($('<li>').text(`${msg.username}:   ${msg.message}`))
})
socket.on('left', function(msg){
  $('.messages').append($('<li class="status">').text(msg))
  container.scrollTop = container.scrollHeight-container.clientHeight//make div scroll to bottom
})

socket.on('joined', function(msg){
  $('.messages').append($('<li class="status">').text(msg))
  container.scrollTop = container.scrollHeight-container.clientHeight//make div scroll to bottom
})
socket.on('typing-in', function(username){
  $('.typing').text(`${username} is typing...`)
})
socket.on('typing-out', function(){
  $('.typing').text('')
})
