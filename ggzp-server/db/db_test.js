const md5 = require('blueimp-md5')
//引入数据库
const mongoose = require('mongoose')
//连接数据库
mongoose.connect('mongodb://localhost/test',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//获取连接对象
const conn = mongoose.connection
//绑定连接完成的监听
conn.on('connected',function() {
  console.log("数据库连接成功")
})
//声明集合结构
const Schema = mongoose.Schema
//建立数据集合结构
const userSchema = new Schema({
  username: {type: String,required: true},
  password: {type: String,required: true,default: '000000'},
  type: {type: String,required: true}
})
//建立模型
const User = mongoose.model('user',userSchema)
//构造模型实例
const admin = new User({
  username: 'Tom',
  password: md5('123456'),
  type: 'dashen'
})
//增
admin.save(function(err,userDoc) {
  if(err) {
    console.log(err)
  }else {
    console.log(userDoc)
  }
})
//查
User.find({username: 'Bruiser'},(err,ret) => {
  if(err) {
    console.log('查询失败')
  }else {
    //ret为查询到的保存当前数据库的所有数据的数组
    console.log(ret)
  }
})
//删
User.remove({
  username: 'Tom'
},(err,ret) => {
  if(err) {
    console.log('删除失败')
  }else {
    //ret为关于删除的一些参数信息
    console.log(ret)
  }
})
//改
User.findByIdAndUpdate('5ecd0fb7c62f001e2c8448f2', {
  name: 'BruiserPink'
},(err,ret) => {
  if(err) {
    console.log('修改失败')
  }else {
    console.log(ret)
  }
})