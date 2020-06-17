import React, { Component } from 'react'
import {NavBar,List,WingBlank,WhiteSpace,InputItem,Button} from 'antd-mobile'
import Logo from '../../components/logo/logo'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
class Login extends Component {
  state = {
    username: '',
    password: '',
  }
  login = () => {
    this.props.login(this.state)
  }
  update = (name,value) => {
    this.setState({
      [name]: value
    })
  }
  toRegister = () => {
    this.props.history.replace('/register')
  }

  render() {
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
            <WhiteSpace />
            <Button type="primary" onClick = {this.login}>登&nbsp;&nbsp;&nbsp;录</Button>
            <WhiteSpace />
            <Button onClick={this.toRegister}>注册</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}
export default connect(
  state => ({user: state.user}),
  {login}
)(Login)