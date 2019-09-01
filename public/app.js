const container = document.querySelector('.container')
const socket = io()


$('.setUsername').submit((e)=>{//sending username to server (will be stored in a session)
  e.preventDefault
  socket.emit('set username', $('.username').val())
  $('.main').css('display','none')
  $('.container').css('display','block')
  $('.message').css('display', 'block')
  $('.message').focus()
  socket.emit('number of users')
  socket.emit('get username')
  return false

})
$('.msg').submit(function(e){//sending message to server
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


socket.on('get username', function(usernames){
    tag = ''
    for(username of usernames){tag += '<li class='+username+'>'+username+'</li>'}
    $('.users-online').html(tag)
})
socket.on('chat message', function(msg){
  container.scrollTop = container.scrollHeight-container.clientHeight//make div scroll to bottom
  //container.scrollTo(0, container.scrollHeight+100) //this works too
  console.log(container.scrollTop, container.clientHeight)
  $('.messages').append($('<li>').text(`${msg.username}:   ${msg.message}`))
})
socket.on('left', function(msg){
  $('.messages').append($('<li class="status">').text(msg.message))
  $('.'+msg.username+'').remove()//removes the li with the username class. That is the way I found to easily delete the username li from the online users. I don't know if it's the best way though.
  container.scrollTop = container.scrollHeight//make div scroll to bottom
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
socket.on('number of users', function(data){
  $('.numUsers').text('('+data+')')
})
