const socket = io();

socket.on('connect', function(){
  console.log('Connected to server')

  socket.emit('createMessage', {
    to: 'address@example.com',
    text: 'hey this is brooke'
  });
});

socket.on('disconnect', function(){
  console.log('Connection dropped')
});

socket.on('newMessage', function(message){
  console.log('New message', message)
});
