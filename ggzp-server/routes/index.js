var express = require('express');
var router = express.Router();
const {UserModel,ChatModel} = require("../db/models")
const md5 = require("blueimp-md5")
const filters = {password: 0,__v: 0} //查询时过滤掉指定属性
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//注册路由
router.post('/register',function(req,res) {
  const {username,password,type} = req.body
  console.log(req.body)
  // 查询数据库是否有相同username
  UserModel.findOne({username},function(err,user) {
    if(user) {
     res.send({code: 1,msg:'该用户已存在'})
    }else {
      const admin = new UserModel({username,type,password: md5(password)})
      admin.save((error,ret) => {
        //生成cookie交给浏览器保存,即注册成功后直接登录
        res.cookie('userid',ret._id,{maxAge: 1000*60*60*24*7})
        const data = {username,type,_id: ret._id}
        res.send({code: 0,data})
      })
    }
  })
})
//登录的路由
router.post('/login',(req,res) => {
  const {username,password} = req.body
  UserModel.findOne({username,password:md5(password)},(err,user) => {
    if(user) {
      // 生成cookie交给浏览器保存,即注册成功后直接登录
      res.cookie('userid',user._id,{maxAge: 1000*60*60*24*7})
      res.send({code: 0, data: user})
    }else {
      res.send({code: 1,msg: '用户名或密码错误'})
    }
  })
})
//修改用户信息的路由
router.post('/update',(req,res) => {
  const userId = req.cookies.userid
  const user = req.body
  if(!userId) {
    return res.send({code: 1,msg: '请先登录'})
  }
  UserModel.findByIdAndUpdate({_id: userId},user,(err,oldUser) => {
    if(!oldUser) {
      //如果找不到对于_id的数据，那么说明当前cookie是一个坏数据,就删除该cookie
      res.clearCookie('userid')
      //返回提示信息
      res.send({code: 1,msg: '请先登录'})
    }else {
      const {_id,username,type} = oldUser
      //Object.assign用于做对象的拼接,并返回一个新的对象
      const data = Object.assign(user,{_id,username,type})
      res.send({code: 0,data})
    }
  })
})
//获取指定类型用户列表信息的路由
router.get('/userlist',(req,res) => {
  const {type} = req.query
  UserModel.find({type},filters,(err,users) => {
    res.send({code: 0,data: users})
  })
})
router.get('/user',(req,res) => {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if(!userid) {
    return res.send({code: 1, msg: '请先登陆'})
  }
  // 根据userid查询对应的user
  UserModel.findOne({_id: userid}, filters, function (error, user) {
    if(user) {
      res.send({code: 0, data: user})
    } else {
      // 通知浏览器删除userid cookie
      res.clearCookie('userid')
      res.send({code: 1, msg: '请先登陆'})
    }
  })
})
//根据当前用户id获取消息和所有user信息
router.get('/msglist', function (req, res) {
  // 获取cookie中的userid
  const userid = req.cookies.userid
  // 查询得到所有user文档数组
  UserModel.find(function (err, userDocs) {
    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, header: user.header}
      return users
    } , {})
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filters, function (err, chatMsgs) {
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})
//修改指定消息为已读
router.post('/readmsg', (req,res) => {
  const {from} = req.body
  const to = req.cookies.userid
  ChatModel.update({from,to,read: false}, {read: true},{multi: true},(err,doc) => {
    res.send({code: 0,data: doc.nModified})//nModified更新的数量
  })
})
//获取当前用户的聊天记录

module.exports = router;
