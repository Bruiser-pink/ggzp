import io from 'socket.io-client'

//连接服务器,得到与服务器连接的对象
const socket = io('ws://localhost:4000')

//发送消息
socket.emit('sendMsg', {name: 'web',age: 19})

console.log('客户端向服务器发消息',{name: 'web',age: 19})

//绑定监听接收服务端发送的消息
socket.on('receiveMsg',function(data) {
  console.log('客户端接收到服务器发送的消息',data)
})

