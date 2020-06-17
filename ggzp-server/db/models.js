//包含N个操作数据库集合数据的Model模块

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/ggzp',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const conn = mongoose.connection

conn.on('connected',() => {
  console.log("DB connect success!!!")
})

const Schema = mongoose.Schema

//定义用户信息数据库的模型
const userSchema = new Schema({
  username: {type: String,required: true},
  password: {type: String,required: true,default: '000000'},
  type: {type: String,required: true},
  header: {type: String}, //头像
  post: {type: String}, //职位
  info: {type: String}, //个人简介
  company: {type: String}, //公司名称
  salary: {type: String} //工资
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema) // 集合为: users

//定义聊天记录的数据库
const chatSchema = mongoose.Schema({
  from: {type: String, required: true}, // 发送用户的id
  to: {type: String, required: true}, // 接收用户的id
  chat_id: {type: String, required: true}, // from和to组成的字符串
  content: {type: String, required: true}, // 内容
  readed: {type:Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
})
// 定义能操作chats集合数据的Model
const ChatModel = mongoose.model('chat', chatSchema) // 集合为: chats
// 向外暴露Model
exports.ChatModel = ChatModel
// 2.3. 向外暴露Model
exports.UserModel = UserModel