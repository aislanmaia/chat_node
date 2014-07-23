exports.index = function (request, response) {
  response.render('index', { title: 'Express '});
}

exports.chatroom = function (request, response) {
  response.render('chatroom', { title: "Express Chat"});
}