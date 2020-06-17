import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import {NavBar} from 'antd-mobile'

import BossInfo from '../boss-info/boss-info'
import ExcellenceInfo from '../excellence-info/excellence-info'
import Boss from '../boss/boss'
import Excellence from '../excellence/excellence'
import Message from '../message/message'
import Personal from '../personal/personal'
import Chat from '../chat/chat'
// import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import {getUser} from '../../redux/actions'
import Cookies from 'js-cookie' //可以操作前端cookie的对象set/get/remove
import {getRedirectTo} from '../../utils/index'
import {connect} from 'react-redux'
class Main extends Component {
  // 给组件对象添加属性
  navList = [ // 包含所有导航组件的相关信息数据
    {
      path: '/boss', // 路由路径
      component: Boss,
      title: '大神列表',
      icon: 'laoban',
      text: '大神',
    },
    {
      path: '/excellence', // 路由路径
      component: Excellence,
      title: '老板列表',
      icon: 'dashen',
      text: '老板',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/personal', // 路由路径
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    }
  ]
  componentDidMount() {
    //对于登录过账号本地有cookie，但是目前没有登录，根
    //据userid请求对应的user信息实现自动登录
    const userId = Cookies.get('userid')
    const {_id} = this.props.user
    if(userId && !_id) {
      //发送异步请求，获取user
      this.props.getUser()
    }
  }
  render() {
    //读取cookie中的user_id(查看是否登录过)
    const userId = Cookies.get('userid')
    const {unReadNum} = this.props
    //如果没有，就自动重定向到登录界面
    if(!userId) {
      return <Redirect to = '/login' />
    }else {
      //如果有，读取redux中的user状态(查看是否已经登录)
      const {user} = this.props
      if(!user._id) {
        //如果user没有_id，返回null
        return null
      }else {
        //如果有_id返回对应页面(根据user的type和head属性，确定要跳转的路由)
        const path = this.props.location.pathname
        if(path === '/') {
          return <Redirect to = {getRedirectTo(user.type,user.header)}/>
        }
      }
    }
    const {navList} = this
    const path = this.props.location.pathname
    const currentNav = navList.find(nav => nav.path === path)
    const {user} = this.props
    if(currentNav) {
      //根据用户类型决定隐藏那个nav-footer
      if(user.type === 'boss') {
        navList[1].hide = true
      }else {
        navList[0].hide = true
      }
    }
    return (
      <div>
        {currentNav ? <NavBar className="stick-head">{currentNav.title}</NavBar> : null}
        <Switch>
          <Route path='/bossinfo' component={BossInfo} />
          <Route path='/excellenceinfo' component={ExcellenceInfo} />
          <Route path='/chat/:userid' component={Chat}  />
          {
            navList.map (nav => <Route key={nav.path} path = {nav.path} component = {nav.component} /> )
          }
        </Switch>
        {currentNav ? <NavFooter navList = {navList} unReadNum = {unReadNum} >{currentNav.title}</NavFooter> : null}
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user,unReadNum: state.chat.unReadNum}),
  {getUser}
)(Main)