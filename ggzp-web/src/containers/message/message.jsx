import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List,Badge} from 'antd-mobile'

//对chat_id进行分组得到每个组的lastMsg组成的数组
function getLastMsg(chatMsgs,userid) {
  //1. 找出每一个聊天的lastMsg，及其chat_id存储在对象中
  const lastMsgObjs = {}
  chatMsgs.forEach(msg => {
    if(msg.to === userid && !msg.read) {
      msg.unReadNum = 1
    }else {
      msg.unReadNum = 0 
    }
    //得到当前msg的聊天id
    const chatId = msg.chat_id
    //得到已保存的当前组件的lastmsg
    let lastMsg = lastMsgObjs[chatId]
    if(!lastMsg) {
      lastMsgObjs[chatId] = msg
    }else {
      //保存已经统计的未读数量 + 当前msg的数量
      const unReadNum = lastMsg.unReadNum + msg.unReadNum
      //如果msg比lastMsg晚，就将msg保存为lastMsg
      if(!msg.create_time < lastMsg.create_time) {
        lastMsgObjs[chatId] = msg
      }
      //将unReadNum保存在最新的l
      lastMsgObjs[chatId].unReadNum = unReadNum
    }
  })
  //2. 得到所有的lastMsgs的数组
  const lastMsgsList = Object.values(lastMsgObjs)
  //3. 对数组根据create_time进行降序排序
  lastMsgsList.sort((m1,m2) => {//如果return小于0，就将m1放在前面
    return m2.create_time - m1.create_time
  })
  return lastMsgsList
}
const Item = List.Item
const Brief = Item.Brief
class Message extends Component {
  render () {
    const {user} = this.props
    const {users,chatMsgs} = this.props.chat
    //对chatMsgs按照chat_id进行分组
    const lastMsgs = getLastMsg(chatMsgs,user._id)
    return (
      <List style={{marginTop: 50}}>
        {
          lastMsgs.map(msg => {
            //得到目标用户的id
            const targetUserId = msg.to === user._id ? msg.from : msg.to
            //得到目标用户的信息
            const targetUser = users[targetUserId]
            return (
              <Item key = {msg._id}
                extra = {<Badge text={msg.unReadNum} />} arrow = 'horizontal'
                onClick = {() => this.props.history.push(`/chat/${targetUserId}`)}
                thumb = {targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null}
              >
                {msg.content}
              {/* 找到msg_id非当前用户_id的user的username */}
              <Brief>{targetUser.username}</Brief>
              </Item>
            )
          })
        }  
      </List>
    )
  }
}

export default connect(
  state => ({user: state.user,chat: state.chat}),
  {}
)(Message)