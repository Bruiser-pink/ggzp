const {ChatModel} = require('../db/models')
module.exports = function (server) {
  const io = require('socket.io')(server)
  //监视客户端与服务器的连接
  io.on('connection',function(socket) {
    console.log('有一个客户端连接上了服务器')
    //绑定监听接收客户端发送的消息
    socket.on('sendMsg',function({from,to,content}) {
      console.log('服务器接收到客户端消息',{from,to,content})
      //处理数据(保存消息)
      const chat_id = [from,to].sort().join('_')
      const create_time = Date.now()
      new ChatModel({from,to,content,chat_id,create_time}).save((err,chatMsg) => {
        //向客户端发消息
        io.emit('receiveMsg',chatMsg)
      })
    })
  })
}