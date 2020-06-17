import React, { Component } from 'react'
import {NavBar,Radio,List,WingBlank,WhiteSpace,InputItem,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {register} from '../../redux/actions'
import Logo from '../../components/logo/logo'
import {Redirect} from 'react-router-dom'
const ListItem = List.Item
class Register extends Component {
  state = {
    username: '',
    password: '',
    password2: '',
    type: 'boss'
  }
  register = () => {
    this.props.register(this.state)
  }
  update = (name,value) => {
    this.setState({
      [name]: value
    })
  }
  toLogin = () => {
    this.props.history.replace('/login')
  }

  render() {
    const {type} = this.state
    const {msg,redirectTo} = this.props.user
    if(redirectTo) {
      return <Redirect to = {redirectTo} />
    }
    return (
      <div>
        <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
        <Logo />
        <WingBlank>
          <List>
            {msg ? <div className="err-msg">{msg}</div>:null}
            <WhiteSpace />
            <InputItem placeholder="请输入用户名" onChange={value => {this.update('username',value)}}>用户名:</InputItem>
            <WhiteSpace />
            <InputItem placeholder="请输入密码" type="password" clear onChange={value => {this.update('password',value)}}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
            <WhiteSpace />
            <InputItem placeholder="请确认密码" type="password" clear onChange={value => {this.update('password2',value)}}>确认密码</InputItem>
            <WhiteSpace />
            <ListItem>
              <span>用户类型:</span>
              &nbsp;&nbsp;&nbsp;
              <Radio checked={type==='excellence'} onChange={() => {this.update('type','excellence')}}>大神</Radio>
              &nbsp;&nbsp;&nbsp;
              <Radio checked={type==='boss'} onChange={() => {this.update('type','boss')}}>老板</Radio>
            </ListItem>
            <WhiteSpace />
            <Button type="primary" onClick = {this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
            <WhiteSpace />
            <Button onClick={this.toLogin}>已有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}
export default connect(
  state => ({user: state.user}),
  {register}
)(Register)