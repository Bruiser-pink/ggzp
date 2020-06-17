import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getUserListInfo} from '../../redux/actions'
import UserList from "../../components/user-list/user-list"
class Boss extends Component {
  //获取数据
  componentDidMount() {
    this.props.getUserListInfo('excellence')
  }
  render () {
    return (
      <UserList userlist = {this.props.userlist}></UserList>
    )
  }
}

export default connect(
  state => ({userlist: state.UserList}),
  {getUserListInfo}
)(Boss)