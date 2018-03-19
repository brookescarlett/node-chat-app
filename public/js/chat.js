const socket = io();

function scrollToBottom () {
  const element = document.getElementById('messages');
  element.scrollIntoView({behavior: "instant", block: "end", inline: "nearest"});
}

socket.on('connect', function(){
  const params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(err) {
    if (err) {
      window.location.href = '/';
      alert(err);
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function(){
  console.log('Connection dropped');
});

socket.on('updateUserList', function(users){
  const ol = jQuery('<ol></ol>');

  users.forEach(function (user){
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('newMessage', function(message){
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime

  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  })

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    text: jQuery('[name=message]').val()
  }, function () {
    jQuery('[name=message]').val('')
  })
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
