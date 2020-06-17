import React, { Component } from 'react';
import {connect} from 'react-redux'
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import HeadSelect from '../../components/head-select/head-select'
//引入异步action
import {updateUser} from '../../redux/actions'
class BossInfo extends Component {
  state = {
    header: '',
    post: '',
    info: '',
    company: '',
    salary: ''
  }
  handleChange = (name,value) => {
    this.setState({
      [name]: value
    })
  }
  save = () => {
    this.props.updateUser(this.state)
  }
  setHeader = (header) => {
    this.setState({
      header
    })
  }
  render() {
    const { header,type } = this.props.user
    if(header) {
      //说明信息已经完善
      const path = type === 'boss' ? '/boss':'/excellence'
      return <Redirect to={path} />
    }
    return (
      <div> 
        <NavBar>老板信息完善</NavBar>
        <HeadSelect setHeader = {this.setHeader} />
        <InputItem placeholder='请输入招聘职位' onChange = {val => {this.handleChange('post',val)}} >招聘职位:</InputItem>
        <InputItem placeholder='请输入公司名称' onChange = {val => {this.handleChange('company',val)}} >公司名称:</InputItem>
        <InputItem placeholder='请输入职位薪资' onChange = {val => {this.handleChange('salary',val)}} >职位薪资:</InputItem>
        <TextareaItem title='职位要求:' rows={3} onChange = {val => {this.handleChange('info',val)}} />
        <Button type="primary" onClick = {this.save}>保存</Button>
      </div>
    );
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(BossInfo)