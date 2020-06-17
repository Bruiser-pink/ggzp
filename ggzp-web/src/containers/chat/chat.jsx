import React, { Component } from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem, Grid, Icon} from 'antd-mobile'
import {sendMsg,readMsg} from '../../redux/actions'
import QueueAnim from 'rc-queue-anim'
const Item = List.Item

class Chat extends Component {
  state = {
    content: '',
    isShow: false//是否显示表情列表
  }
  //在第一次render之前回调
  componentWillMount() {
    const emojis = ['😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀'
    ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣'
    ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣'
    ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣']
    this.emojis = emojis.map(emoji => ({text: emoji}) )
  }
  //进入页面后就让滚动条到最底部
  componentDidMount() {
    window.scrollTo(0,document.body.scrollHeight)
    const targetId = this.props.match.params.userid
    const userid = this.props.user._id
    //发请求更新消息的未读数量
    this.props.readMsg(targetId,userid)
  }
  //发送一条消息后就让滚动条到最底部
  componentDidUpdate() {
    window.scrollTo(0,document.body.scrollHeight)
  }
  handleSend = () => {
    //收集数据
    const from = this.props.user._id
    const to = this.props.match.params.userid
    const content = this.state.content.trim()
    //发送请求
    if(content) {
      this.props.sendMsg({from,to,content})
    }
    this.setState ({
      content: ''
    })
  }
  toggleShow = () => {
    const isShow = !this.state.isShow
    this.setState({isShow})
    if(isShow) {
      //异步手动派发resize事件，解决列表显示两次的问题
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      })
    }
  }

  render() {
    const {user} = this.props
    const {users,chatMsgs} = this.props.chat
    // 获取当前聊天的chatId
    const myId = user._id
    if(!users[myId]) {//如果没获取到数据，返回空白
      return null
    }
    const targetId = this.props.match.params.userid
    const targetName = users[targetId].username
    const chatId = [myId,targetId].sort().join('_')
    const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
    // 得到对方的头像
    const targetHead = users[targetId].header
    const targetIcon = targetHead ? require(`../../assets/images/${targetHead}.png`) : null
    return (
      <div id = 'chat-page'> 
        <NavBar icon = {<Icon type = 'left'size = 'lg' />} className = 'stick-head'
         onLeftClick = {() => this.props.history.goBack()} >{targetName}</NavBar>
        <List className = 'msg-list' style ={{marginTop: 50, marginBottom: 50}} >
          <QueueAnim type='left' delay = {20} >
            {
              msgs.map(msg => {
                if(myId === msg.to) {//对方发给我的
                  return (
                    <Item key={msg._id} thumb = {targetIcon}>
                      {msg.content}
                    </Item>
                  )
                }else {
                  return (
                    <Item extra = '我'
                    className = 'chat-me'
                    key={msg._id}>
                      {msg.content}
                    </Item>
                  )
                }
              })
            }
          </QueueAnim>
        </List>
        <div className = "am-tab-bar" >
          <InputItem placeholder = "请输入" 
            value = {this.state.content}
            onFocus = {() => this.setState({isShow: false})}
            extra = {
              <span>
                <span style={{marginRight: 8, fontSize: 16}} 
                  onClick = {this.toggleShow}>😊</span>
                <span onClick = {this.handleSend}>发送</span>
              </span>
            }
            onChange = {val => this.setState({content: val})} /> 
            {this.state.isShow ? 
              (<Grid data = {this.emojis} columnNum = {8}
              carouselMaxRow = {4} isCarousel = {true} 
              onClick = {(item) => {
                this.setState({content: this.state.content + item.text})
              }} />) : null
            }
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({user: state.user,chat: state.chat}),
  {sendMsg,readMsg}
)(Chat)
