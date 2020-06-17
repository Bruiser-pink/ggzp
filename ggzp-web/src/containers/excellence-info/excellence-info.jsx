import React, { Component } from 'react'
import {connect} from 'react-redux'
import {NavBar,InputItem,Button,TextareaItem} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import HeadSelect from '../../components/head-select/head-select'
import {updateUser} from '../../redux/actions'
class ExcellenceInfo extends Component {
  state = {
    header: '',
    post: '',
    info: '',
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
      const path = type === 'excellence' ? '/excellence':'boss'
      return <Redirect to={path} />
    }
    return (
      <div> 
        <NavBar>大神信息完善</NavBar>
        <HeadSelect setHeader = {this.setHeader} />
        <InputItem placeholder='请输入求职岗位'  onChange = {val => {this.handleChange('post',val)}}>求职岗位:</InputItem>
        <TextareaItem title='个人介绍' rows= {3} placeholder='请输入个人介绍'  onChange = {val => {this.handleChange('info',val)}}>个人介绍:</TextareaItem>
        <Button type="primary" onClick = {this.save}>保存</Button>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(ExcellenceInfo)