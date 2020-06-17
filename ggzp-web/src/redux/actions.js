import {postRegisterInfo, postLoginInfo,
        postUpdate,getUserList,
        getUserInfo,getChatMsgList,putMsgReaded} from '../api/index'
import {AUTH_SUCCESS,ERROR_MSG,
        RECEIVE_USER,RESET_USER,
        RECEIVE_USER_LIST,
        REVEIVE_MSG,RECEIVE_MSG_LIST,
        MSG_READ} from './action-types'
import io from 'socket.io-client'

//授权成功的同步action
const authSuccess = (user) => ({
  type: AUTH_SUCCESS,
  data: user
})
//错误提示的同步action
const errorMsg = (msg) => ({
  type: ERROR_MSG,
  data: msg
})
//接收用户的同步action
const receiveUser = (user) => ({
  type: RECEIVE_USER,
  data: user
})
export const resetUser = (msg) => ({
  type: RESET_USER,
  data: msg
})

//接收用户列表的同步action
export const receiveUserList = (userList) => ({
  type: RECEIVE_USER_LIST,
  data: userList
})
//接收消息列表的同步action
const receiveMsgList = ({users,chatMsgs,userid}) => ({
  type: RECEIVE_MSG_LIST,
  data: {users,chatMsgs,userid}
})
//接收一个消息的同步action
const receiveMsg = (chatMsg,userid) => ({
  type: REVEIVE_MSG,
  data: {chatMsg,userid}
})
//一个工具函数，用来异步获取消息列表数据
async function getMsgList(dispatch,userid) {
  //在此处表示只要用户一登录就初始化io
  initIo(dispatch,userid)
  const response = await getChatMsgList()
  const result = response.data
  if(result.code === 0) {
    const {users,chatMsgs} = result.data
    //分发同步action
    dispatch(receiveMsgList({users,chatMsgs,userid}))
  }
}
//注册的异步action
export const register = (user) => {
  const {username,password,password2,type} = user
  //表单的前端验证
  if(!username) {
    return errorMsg('用户名不能为空')
  }
  if(!password) {
    return errorMsg('密码不能为空')
  }
  if(password !== password2) {
    return errorMsg('2次密码不一致')
  }
  //表单数据合法，就是发出一个异步action
  return async dispatch => {
    const response = await postRegisterInfo({username,password,type})
    const result = response.data
    if(result.code === 0) {
      //注册成功获取消息列表
      getMsgList(dispatch,result.data._id)
      //成功
      dispatch(authSuccess(result.data))
    }else {
      dispatch(errorMsg(result.msg))
    }
  }
}
//登录的异步action
export const login = (user) => {
  const {username,password} = user
  //表单的前端验证
  if(!username) {
    return errorMsg('用户名不能为空')
  }
  if(!password) {
    return errorMsg('密码不能为空')
  }
  return async dispatch => {
    const response = await postLoginInfo(user)
    const result = response.data
    if(result.code === 0) {
      //登录注册成功获取消息列表
      getMsgList(dispatch,result.data._id)
      //成功
      dispatch(authSuccess(result.data))
    }else {
      dispatch(errorMsg(result.msg))
    }
  }
}
//修改用户信息的异步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await postUpdate(user)
    const result = response.data
    if(result.code === 0) {
      dispatch(receiveUser(result.data))
    }else {
      dispatch(resetUser(result.msg))
    }
  }
}
//获取用户列表的异步action
export const getUserListInfo = (type) => {
  return async dispatch => {
    const response = await getUserList(type)
    const result = response.data
    if(result.code === 0) {
      getMsgList(dispatch,result.data._id)
      dispatch(receiveUserList(result.data))
    }
  }
}
//获取用户信息的异步acions
export const getUser = () => {
  return async dispatch => {
    //执行异步action
    const response = await getUserInfo()
    const result = response.data
    if(result.code === 0) {
      getMsgList(dispatch,result.data._id)
      dispatch(receiveUser(result.data))
    }else {
      dispatch(resetUser(result.msg))
    }
  }
}
//使用单例对象存储socket对象
function initIo(dispatch,userid) {
  //创建对象前，判断对象是否已经存在
  if(!io.socket) {
    //如果不存在，创建socket对象连接服务器
    io.socket = io('ws://localhost:4000')
    //绑定监听，接收服务器发送的消息
    io.socket.on('receiveMsg',(chatMsg) => {
    //只有当chatMsg是与当前用户相关的消息，才去分发action保存消息
    if(userid === chatMsg.from || userid === chatMsg.to) {
      dispatch(receiveMsg(chatMsg,userid))
    }
  })
  }
} 

//发送消息的异步action
export const sendMsg = ({from,to,content}) => {
  return dispatch => {
    //发消息
    io.socket.emit('sendMsg',{from,to,content})
  }
}

//读取消息的同步action
const msgRead = ({count ,from ,to}) => ({
  type: MSG_READ,
  data:{count ,from ,to}
})
//读取消息的异步action
export const readMsg = (from,to) => {
  return async dispatch => {
    const response = await putMsgReaded(from)
    const result = response.data
    if(result.code === 0) {
      const count = result.data
      dispatch(msgRead({count,from,to}))
    }
  }
}