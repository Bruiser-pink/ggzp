import {combineReducers} from 'redux'
import {AUTH_SUCCESS,ERROR_MSG,
        RECEIVE_USER,RESET_USER,
        RECEIVE_USER_LIST,
        RECEIVE_MSG_LIST,REVEIVE_MSG,
        MSG_READ} from './action-types'
import {getRedirectTo} from '../utils/index'
const initUser = {
  username: '',
  type: '',
  msg:'',//错误提示信息
  redirectTo: ''
}
//产生user状态的reducer
function user(state = initUser,action) {
  switch(action.type) {
    case AUTH_SUCCESS: 
      const {type,header} = action.data
      return {...action.data,redirectTo:getRedirectTo(type,header)}
    case ERROR_MSG:
      return {...state,msg:action.data}
    case RECEIVE_USER:
      return action.data
    case RESET_USER:
      return {...initUser,msg:action.data}
    default: 
      return state  
  }
}
const initUserList = []
//产生userlist状态的reducer
function UserList(state = initUserList,action) {
  switch (action.type) {
    case  RECEIVE_USER_LIST: 
      return action.data
    default: 
      return state
  }
}

const initChatList = {
  chatMsgs: [],//当前用户所有相关msg的数组
  unReadNum: 0, //总的未读消息的数量
  users: {}//所有用户信息的对象{username,header}
}
//产生聊天状态的redux
function chat(state= initChatList,action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST: 
      const {users,chatMsgs,userid} = action.data
      return {
        users,
        chatMsgs,
        unReadNum: chatMsgs.reduce((preTotal,msg) => preTotal + (!msg.read && msg.to === userid ? 1 : 0),0)}
    case REVEIVE_MSG:
      const {chatMsg} = action.data
      return {
        users: state.users,
        chatMsgs: [...state.chatMsgs,chatMsg],
        unReadNum: state.unReadNum + (!chatMsg.read && chatMsg.to === action.data.userid ? 1 : 0)
      }
    case MSG_READ:
      const {from,to,count} = action.data
      state.chatMsgs.forEach(msg => {
        if(msg.from === from && msg.to === to && !msg.read) {
          msg.read = true
        }
      })
      return {
        users: state.users,
        chatMsgs: state.chatMsgs.map(msg => {
          if(msg.from === from && msg.to === to && !msg.read) {
            return {...msg,read: true}
          }else {
            return msg
          }
        }),
        unReadNum: state.unReadNum - count
      }
    default: 
      return state
  }
}

export default combineReducers({
  user,
  UserList,
  chat
})
