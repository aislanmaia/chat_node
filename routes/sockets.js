var io = require('socket.io');

exports.initialize = function(server) {
  io = io.listen(server);
  var self = this;

  this.chat_com = io.of("/chat_com");
  this.chat_com.on("connection", function(socket){   

    socket.on('message', function(message){
      message = JSON.parse(message);

      if(message.type == "userMessage"){
        socket.get('nickname', function(err, nickname) {
          message.username = nickname;
          socket.in(socket.room).broadcast.send(JSON.stringify(message));
          message.type = "myMessage";
          socket.send(JSON.stringify(message));
        });                
      }
    });
  });

  this.chat_infra = io.of("/chat_infra");
  this.chat_infra.on("connection", function(socket){    

    socket.on('set_name', function (data) {
      socket.set('nickname', data.name, function(){
        socket.emit('name_set', data);

        socket.send(JSON.stringify({
            type:'serverMessage',
            message: 'Welcome to the most interesting chat room on earth!'
          })
        );
        //socket.broadcast.emit('user_entered', data);
      });          
      
    });    

    socket.on('join_room', function (room) {
      socket.get('nickname', function(err, nickname){
        socket.join(room);

        // Também é necessário juntar-se à sala o objeto namespace chat_com
        var com_socket =  self.chat_com.sockets[socket.id];
        com_socket.join(room.name);
        com_socket.room = room.name;

        var message_notify = {
          username: nickname
        };

        // Anunciando na sala que que o cliente tem se conectado.
        // Porém, ao invés de chamar no próprio socket, chamamos a partir da sala,
        // de modo a restringir os receptores à somente aqueles conectados na sala.
        socket.in(room.name).broadcast.send(JSON.stringify(message_notify));
        
      });          
      
    });    
    
  });

};
