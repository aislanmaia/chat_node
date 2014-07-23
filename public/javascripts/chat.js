var chat_infra = io.connect('/chat_infra'); // conecta para o servidor no namespace chat_infra
var chat_com = io.connect('/chat_com'); // conecta para o servidor no namespace chat_com

var room_name = decodeURI(
  (RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);

if (room_name) {

  chat_infra.on('name_set', function (data) {
    chat_infra.emit('join_room', {'name': room_name});

    $('#nameform').hide();
    $('#messages').append('<div class="systemMessage"> Hello ' + data.name + '</div>');

    $('#send').click(function () {    
      var data = {
        message: $('#message').val(),
        type: 'userMessage',      
      };    
      chat_com.send(JSON.stringify(data));
      $('#message').val('');
    });

    chat_infra.on('user_entered', function (user) {
      $('#messages').append('<div class="systemMessage">'+ user.name +' has joined the room.</div>');
    });

    chat_infra.on('message', function(message) {
      var message = JSON.parse(message);
      $('#messages').append('<div class="'+ message.type + '">' + message.message + '</div>');
    })

    chat_com.on('message', function (data) {
      data = JSON.parse(data);    
      $('#messages').append('<div class="' + data.type + '"><span class="name">' + data.username + ": </span>"
                                 + data.message +
                             '</div>');    
    });
  });
}

$(function () { 

  $('#setname').click(function () {    
      chat_infra.emit("set_name", {name: $('#nickname').val()});
  });
});